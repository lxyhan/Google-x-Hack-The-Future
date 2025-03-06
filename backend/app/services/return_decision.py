from ..utils.gemini_client import GeminiClient
import json

class ReturnDecisionService:
    def __init__(self, return_policy_rules: dict):
        self.gemini = GeminiClient()
        self.return_policy_rules = return_policy_rules

    async def determine_final_outcome(self, defect_analysis: dict, fraud_analysis: dict) -> dict:
        prompt = f"""
        Based on the defect analysis, fraud analysis, and return policy rules, determine the final outcome of the return request.

        1. If the item is in 'Like New' condition with no fraud detected, approve for Resale.
        2. If minor defects are present but repairable, approve for Refurbishment and estimate refurb cost.
        3. If the item is severely damaged or not resale-worthy, consider Recycling/Donation.
        4. If fraud is suspected, deny the return with a reason.
        5. Apply the return policy rules to refine the decision.
        6. Generate a product description based on its current condition and any defects.

        Return Policy Rules: {json.dumps(self.return_policy_rules)}
        Defect Analysis: {json.dumps(defect_analysis)}
        Fraud Analysis: {json.dumps(fraud_analysis)}

        Provide a JSON response in the following format:
        {{
            "final_outcome": "Resold|Refurbished|Recycled/Donated|Denied",
            "resale_details": {{"platform": "platform_name", "price": float}} if applicable,
            "refurbish_details": {{"condition": "condition_description", "cost": float}} if applicable,
            "recycle_donation_details": {{"destination": "charity or recycling facility"}} if applicable,
            "denial_reason": "Reason for denial if applicable",
            "product_description": "Detailed description of the product based on its condition and any defects."
        }}
        """
        
        result = await self.gemini.analyze_content(prompt)
        if isinstance(result, str):
            return json.loads(result)
        return result  # If already a dictionary/list, return as is
