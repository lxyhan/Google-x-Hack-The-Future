from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from typing import List
from .services.defect_detection import DefectDetectionService
from .services.fraud_detection import FraudDetectionService
from .services.condition_grading import ConditionGradingService
from .services.pricing import PricingService
from .utils.firebase_client import FirebaseClient

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
firebase = FirebaseClient()
defect_service = DefectDetectionService()
fraud_service = FraudDetectionService()
condition_service = ConditionGradingService()
pricing_service = PricingService()

@app.get("/")
async def root():
    return {"message": "Welcome to Return AI API"}

@app.post("/api/analyze-return")
async def analyze_return(
    return_data: dict,
    images: List[UploadFile] = File(...)
):
    try:
        # Process images
        pil_images = []
        for image in images:
            content = await image.read()
            pil_image = Image.open(io.BytesIO(content))
            pil_images.append(pil_image)
        
        # Run parallel analysis
        defect_analysis = await defect_service.analyze_product_image(pil_images[0])
        user_history = await firebase.get_user_history(return_data['user_id'])
        fraud_analysis = await fraud_service.analyze_return_pattern(user_history)
        condition_grade = await condition_service.grade_condition(
            pil_images[0], 
            return_data['product_category']
        )
        
        # Get pricing and marketplace recommendations
        price_recommendation = await pricing_service.get_price_recommendation(
            return_data['original_price'],
            condition_grade['grade'],
            return_data['product_category'],
            {}  # Add market data here
        )
        
        # Save results to Firebase
        analysis_result = {
            **return_data,
            'defect_analysis': defect_analysis,
            'fraud_analysis': fraud_analysis,
            'condition_grade': condition_grade,
            'price_recommendation': price_recommendation
        }
        
        return_id = await firebase.save_return_request(analysis_result)
        
        return {
            'return_id': return_id,
            **analysis_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/return/{return_id}")
async def get_return(return_id: str):
    try:
        return await firebase.get_return(return_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Return not found")
        