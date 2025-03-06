from ..utils.gemini_client import GeminiClient
import json

class FraudDetectionService:
    def __init__(self):
        self.gemini = GeminiClient()

    async def analyze_return_pattern(self, return_data: dict, user_history: dict) -> dict:
        prompt = f"""
        Analyze this user's return history and the current return request for fraudulent patterns, focusing on:
        1. Return Frequency: Check if the user frequently returns items.
        2. Timing: Analyze time between purchase and return (potential wardrobing).
        3. Item Condition: Compare returned item condition to user-submitted photos and notes.
        4. High-Value Returns: Identify patterns involving expensive items.
        5. Previous Fraudulent Behavior: Review any history of flagged behaviors such as receipt fraud, counterfeit substitution, or reselling exploits.

        User History: {json.dumps(user_history)}
        Current Return Data: {json.dumps(return_data)}

        Provide a JSON analysis with:
        {{
            "is_fraudulent": boolean,
            "risk_score": 0.0-1.0,  # AI risk score based on fraud detection (0-100%)
            "flags": ["list of suspicious patterns"],
            "fraud_reason": "Explanation for why it was flagged (e.g., excessive returns, receipt fraud, counterfeit substitution)",
            "previous_returns_count": number,  # Total previous returns by the user
            "return_pattern_analysis": {{
                "frequent_returns": boolean,
                "expensive_items_only": boolean,
                "wardrobing_suspected": boolean,
                "receipt_fraud_suspected": boolean,
                "counterfeit_substitution_suspected": boolean,
                "reselling_exploits_suspected": boolean
            }}
        }}
        """
        
        result = await self.gemini.analyze_content(prompt)
        if isinstance(result, str):
            return json.loads(result)
        return result  # If already a dictionary/list, return as is
