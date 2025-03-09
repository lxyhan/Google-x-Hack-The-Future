from ..utils.gemini_client import GeminiClient
import json

class FraudDetectionService:
    def __init__(self):
        self.gemini = GeminiClient()

    async def analyze_return_pattern(self, return_data: dict, user_history: dict) -> dict:
        prompt = f"""
        Analyze the return request for potential fraudulent patterns by assessing the following key factors:
        
        Fraud Detection Criteria:
        1. Fraud Score (0-100): Evaluate the likelihood of fraud based on historical return data, behavioral patterns, and anomaly detection.
        2. Customer Return History: Identify excessive returns within a given time frame.
        3. Return Timing & Usage Pattern:
            - Compare time between purchase and return (flag short usage periods indicating potential wardrobing).
            - Detect patterns of purchasing, using, and returning items.
        4. High-Value Item Flag:
            - Identify returns involving items priced at $100, $200, $500+, where fraud attempts are more common.
        5. Condition & Discrepancies:
            - Compare the returned item's condition to original listing photos, descriptions, and user-submitted return notes.
            - Detect mismatches (e.g., counterfeit swap, missing parts, different serial numbers).
        6. Common Fraud Types:
            - Wardrobing (Temporary use and return)
            - Counterfeit Swap (Replacing a genuine item with a fake)
            - Fake Receipt (Fraudulent return with an altered or fake receipt)
            - Other Suspicious Behaviors (User-defined anomaly patterns)
        7. Previous Fraudulent Behavior:
            - Check for any historical fraud flags in past transactions.
            - Identify reselling exploits (e.g., buying discounted items and returning duplicates).
        
        User & Return Data for Evaluation
        User History: {json.dumps(user_history)}
        Current Return Data: {json.dumps(return_data)}

        Expected JSON Response Format:
        {{
            "risk_category": "Low|Medium|High",  # Fraud risk classification
            "risk_score": float,  # AI-generated fraud risk score (0-100%)
            "flags": ["List of detected fraud patterns"],
            "fraud_reason": "Detailed explanation of why the return is flagged (e.g., excessive returns, counterfeit swap, receipt fraud).",
            "previous_returns_count": int,  # Total historical return count
            "return_pattern_analysis": {{
                "frequent_returns": boolean,  # Has the user exceeded return frequency thresholds?
                "expensive_items_only": boolean,  # Does the user primarily return high-value items?
                "wardrobing_suspected": boolean,  # Short-term usage detected?
                "receipt_fraud_suspected": boolean,  # Fake or altered receipt detected?
                "counterfeit_substitution_suspected": boolean,  # Item mismatch with original purchase?
                "reselling_exploits_suspected": boolean  # Pattern of purchasing and returning similar items?
            }}
        }}
        """
        
        result = await self.gemini.analyze_content(prompt)
        if isinstance(result, str):
            return json.loads(result)
        return result  # If already a dictionary/list, return as is
