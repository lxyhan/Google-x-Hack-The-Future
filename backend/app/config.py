from dotenv import load_dotenv
import os
from pydantic_settings import BaseSettings

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_path)

class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    FIREBASE_CREDENTIALS: str
    MODEL_NAME: str = "gemini-2.0-flash"
    
    # AI Model parameters
    TEMPERATURE: float = 0.7
    TOP_P: float = 0.95
    TOP_K: int = 40
    MAX_TOKENS: int = 8192
    
    # Fraud detection thresholds
    FRAUD_RISK_THRESHOLD: float = 0.7
    RETURN_FREQUENCY_THRESHOLD: int = 5  # returns per month
    
    # Condition grading thresholds
    CONDITION_CONFIDENCE_THRESHOLD: float = 0.8

    class Config:
        env_file = env_path
        env_file_encoding = "utf-8"

# Initialize settings
settings = Settings()

# Debug: Check if variables are loaded correctly
print("GOOGLE_API_KEY:", settings.GOOGLE_API_KEY)
print("FIREBASE_CREDENTIALS:", settings.FIREBASE_CREDENTIALS)
