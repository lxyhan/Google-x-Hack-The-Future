from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ReturnRequest(BaseModel):
    return_id: str
    order_id: str
    user_id: str
    product_id: str
    product_name: str
    product_details: dict  # Includes Size, Colour, SKU, Category, Price, etc.
    customer_name: str
    customer_contact: str
    date_of_purchase: datetime
    date_of_return: datetime
    return_reason: str  # E.g., Didn’t fit, defective, changed mind, wardrobing
    photos: List[str]  # Base64 encoded images
    user_submitted_notes: Optional[str]

class ProductCondition(BaseModel):
    product_category: str  # Auto-detected category
    condition_grade: str  # "Like New", "Used - Good", "Salvage"
    defects: List[str]
    confidence_score: float
    condition_details: List[str]  # Additional wear, functionality, etc.
    estimated_value_retention: int  # Percentage (0-100)
    recommended_action: str  # "Restock", "Repair", "Liquidate", "Recycle"

class FraudCheck(BaseModel):
    is_fraudulent: bool
    risk_score: float
    flags: List[str]
    fraud_reason: Optional[str]
    previous_returns_count: int
    return_pattern_analysis: dict  # Frequent returns, wardrobing, receipt fraud, etc.

class PricingRecommendation(BaseModel):
    suggested_price: float
    original_price: float
    condition_factor: float
    market_demand_factor: float

class ReturnDecision(BaseModel):
    final_outcome: str  # "Resold", "Refurbished", "Recycled/Donated", "Denied"
    resale_details: Optional[dict]  # Platform & price if applicable
    refurbish_details: Optional[dict]  # Repair cost, condition post-refurbishment
    recycle_donation_details: Optional[dict]  # Destination (charity, recycling)
    denial_reason: Optional[str]
    product_description: str
