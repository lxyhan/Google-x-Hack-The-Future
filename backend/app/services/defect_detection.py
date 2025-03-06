from ..utils.gemini_client import GeminiClient
from PIL import Image
import json

class DefectDetectionService:
    def __init__(self):
        self.gemini = GeminiClient()

    async def identify_product_category(self, image: Image.Image) -> str:
        """
        Uses AI to analyze the image and determine the product category.
        """
        prompt = """
        Identify the product category from this image. Examples include:
        - Electronics (Laptop, Smartphone, Headphones)
        - Apparel (Shirt, Shoes, Jacket)
        - Furniture (Chair, Table, Sofa)
        - Accessories (Watch, Bag, Sunglasses)
        - Home Appliances (Microwave, Blender, Vacuum)

        Return the result in JSON format:
        {
            "product_category": "identified_category"
        }
        """

        result = await self.gemini.analyze_content(prompt, image)
        if isinstance(result, str):
            return json.loads(result).get("product_category", "Unknown")
        return result.get("product_category", "Unknown")

    async def analyze_product_image(self, image: Image.Image) -> dict:
        """
        Identifies the product category first, then analyzes defects and condition.
        """
        product_category = await self.identify_product_category(image)

        prompt = f"""
        Analyze this image of a {product_category} product and:
        1. Identify any visible defects (scratches, tears, missing parts).
        2. Assess its overall condition, considering:
            - Wear and tear
            - Functionality
            - Cosmetic condition
            - Market value impact
        3. Grade the condition as one of the following: Like New, Used - Good, Salvage.
        4. Provide a confidence score for the condition grade.
        5. Estimate the percentage of value retention (0-100).
        6. Recommend a course of action: Restock, Repair, Liquidate, Recycle.

        Return the results in JSON format:
        {{
            "product_category": "{product_category}",
            "defects": ["list of defects found"],
            "condition_grade": "grade",
            "confidence_score": 0.0-1.0,
            "condition_details": ["list of condition observations"],
            "estimated_value_retention": 0-100,
            "recommended_action": "Restock|Repair|Liquidate|Recycle"
        }}
        """
        
        result = await self.gemini.analyze_content(prompt, image)
        if isinstance(result, str):
            return json.loads(result)
        return result  # If already a dictionary/list, return as is
