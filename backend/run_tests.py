import asyncio
import json
from PIL import Image
from app.services.defect_detection import DefectDetectionService
from app.services.fraud_detection import FraudDetectionService
from app.services.return_decision import ReturnDecisionService

async def run_tests():
    # Load test image
    test_image = Image.open('test_image.png')

    # Test user history for fraud detection
    test_user_history = {
        "user_id": "test123",
        "returns": [
            {
                "date": "2024-03-01",
                "product": "Electronics",
                "price": 499.99,
                "condition": "Like New",
                "days_until_return": 5
            },
            {
                "date": "2024-02-15",
                "product": "Electronics",
                "price": 899.99,
                "condition": "Used - Good",
                "days_until_return": 25
            }
        ]
    }

    # Test return request
    test_return_request = {
        "date": "2024-03-10",
        "product": "Accessories",
        "price": 99.99,
        "condition": "Used - Good",
        "days_until_return": 7
    }

    print("\n=== Testing Defect Detection ===")
    defect_service = DefectDetectionService()
    defect_result = await defect_service.analyze_product_image(test_image)
    print(json.dumps(defect_result, indent=2))

    print("\n=== Testing Fraud Detection ===")
    fraud_service = FraudDetectionService()
    fraud_result = await fraud_service.analyze_return_pattern(test_return_request, test_user_history)  # Fix: added `await`
    print(json.dumps(fraud_result, indent=2))

    print("\n=== Testing Return Decision Service ===")
    return_policy_rules = {
        "electronics": {"return_window": 30, "requires_original_box": True},
        "apparel": {"return_window": 15, "final_sale": False},
        "accessories": {"return_window": 20, "final_sale": False}
    }

    return_decision_service = ReturnDecisionService(return_policy_rules)
    return_decision_result = await return_decision_service.determine_final_outcome(defect_result, fraud_result)  # Fix: added `await`
    print(json.dumps(return_decision_result, indent=2))

if __name__ == "__main__":
    asyncio.run(run_tests())
