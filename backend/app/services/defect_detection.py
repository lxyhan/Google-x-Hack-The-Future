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
        Identify the specific type of apparel from this image. Examples include:
        - Shirt
        - Shoes
        - Jacket
        - Pants
        - Dress
        - Hat
        - Sweater
        - Skirt

        Return the result in JSON format:
        {
            "product_category": "identified_type"
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
        Analyze this image of a {product_category} product and perform the following assessments:

        1. Identify any visible defects, such as:
        - Scratches, stains, discoloration
        - Tears, holes, missing parts
        - Broken zippers, buttons, laces, or other functional damage

        2. Assess the overall condition, considering:
        - Wear and tear (Is the fabric stretched, faded, or heavily used?)
        - Functionality (Are zippers, buttons, and fasteners intact and working?)
        - Cosmetic condition (Does it look new, slightly worn, or heavily damaged?)
        - Market value impact (How do these factors affect resale potential?)

        3. Grade the condition as one of the following:
        - Like New: No visible defects, minimal signs of wear, fully functional.
        - Used - Good: Minor defects (e.g., light stains, small scratches), but still wearable/usable.
        - Salvage: Major defects (e.g., large tears, missing parts), significantly reducing usability.

        4. Provide a confidence score (0.0-1.0) for the condition grade.

        5. Estimate the percentage of value retention (0-100), considering its resale market.

        6. Recommend a course of action based on condition:
        - Resell: If the item is Like New or Used - Good, with high market value.
        - Refurbish: If the item has repairable defects (e.g., missing buttons, minor tears).
        - Donate: If the item is used but still wearable but has low resale value.
        - Recycle: If the item is too damaged for use but can be broken down (e.g., fabric recycling).
        - Repurpose: If the item cannot be worn but can be converted into another product (e.g., fabric for crafts).
        - Compost: If the item is fully biodegradable and no longer usable.
        - Disposal: If the item is severely damaged, non-recyclable, and cannot be repurposed.

        Return the results in JSON format:
        {{
            "product_category": "{product_category}",
            "defects": ["list of defects found"],
            "condition_grade": "Like New|Used - Good|Salvage",
            "confidence_score": 0.0-1.0,
            "condition_details": ["list of condition observations"],
            "estimated_value_retention": 0-100,
            "recommended_action": "Resell|Refurbish|Donate|Recycle|Repurpose|Compost|Disposal"
        }}
        """
        
        result = await self.gemini.analyze_content(prompt, image)
        if isinstance(result, str):
            return json.loads(result)
        return result  # If already a dictionary/list, return as is
