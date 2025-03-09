import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

class FirebaseClient:
    def __init__(self):
        if not firebase_admin._apps:
            firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")
            if not firebase_credentials:
                raise Exception("FIREBASE_CREDENTIALS environment variable not set")
            cred = credentials.Certificate(firebase_credentials)
            firebase_admin.initialize_app(cred)
        self.db = firestore.client()

    async def save_return_request(self, return_data: dict) -> str:
        """Save return request to Firestore"""
        doc_ref = self.db.collection('returns').document()
        return_data['timestamp'] = datetime.now()
        doc_ref.set(return_data)
        return doc_ref.id

    async def get_user_history(self, user_id: str) -> dict:
        """Retrieve user's return history"""
        returns = self.db.collection('returns').where('user_id', '==', user_id).stream()
        return {
            'user_id': user_id,
            'returns': [doc.to_dict() for doc in returns]
        }

    async def update_return_status(self, return_id: str, status_update: dict) -> None:
        """Update return request status"""
        doc_ref = self.db.collection('returns').document(return_id)
        doc_ref.update(status_update)