from ..utils.gemini_client import GeminiClient
import json

class ReturnDecisionService:
    def __init__(self, return_policy_rules: dict):
        self.gemini = GeminiClient()
        self.return_policy_rules = return_policy_rules

    async def determine_final_outcome(self, defect_analysis: dict, fraud_analysis: dict) -> dict:
        prompt = f"""
        Evaluate the return request based on the customized return policy rules, defect analysis, and fraud analysis.

        Decision Criteria:
        1. Resell - If the item is in 'Like New' condition, fully functional, and has no signs of fraud, approve for resale.
        2. Refurbish - If the item has minor defects that can be repaired, approve for refurbishment and estimate repair costs.
        3. Donate - If the item is functional but not suitable for resale or refurbishment, consider donation to a charitable organization.
        4. Recycle - If the item is damaged beyond repair but contains recyclable materials, recommend recycling.
        5. Repurpose - If the item can be used for alternative purposes (e.g., fabric reuse for clothing), suggest repurposing.
        6. Compost - If the item is made of biodegradable material and cannot be reused, recommend composting.
        7. Dispose - If the item has no viable reuse, refurbishment, or recycling potential, recommend disposal as a last resort.
        8. Pending (Manual Review) - If fraud is suspected or the item's condition is unclear, flag for manual review.

        Return Policy Rules: {json.dumps(self.return_policy_rules)}
        Defect Analysis: {json.dumps(defect_analysis)}
        Fraud Analysis: {json.dumps(fraud_analysis)}

        Expected JSON Response Format:
        {{
            "final_outcome": "Resell|Refurbish|Donate|Recycle|Repurpose|Compost|Dispose|Pending",
            "resale_details": {{"platform": "platform_name", "price": float}} if applicable,
            "refurbish_details": {{"condition": "condition_description", "cost": float}} if applicable,
            "donation_details": {{"organization": "charity_name"}} if applicable,
            "recycle_details": {{"facility": "recycling_center"}} if applicable,
            "pending_reason": "Flagged for manual review due to suspected fraud or unclear condition" if applicable,
            "product_description": "Detailed summary of the item's condition and defects."
        }}
        """
        
        result = await self.gemini.analyze_content(prompt)
        if isinstance(result, str):
            return json.loads(result)
        return result  # If already a dictionary/list, return as is
