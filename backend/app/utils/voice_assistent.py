import os
import json
import asyncio
import gtts
import playsound
import speech_recognition as sr
from datetime import datetime
from firebase_client import FirebaseClient
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

class VoiceAssistant:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise Exception("GOOGLE_API_KEY environment variable not set")
        genai.configure(api_key=api_key)

        self.gemini = genai.GenerativeModel('gemini-2.0-flash')
        self.recognizer = sr.Recognizer()
        self.firebase_client = FirebaseClient()

    def text_to_speech(self, text: str):
        """Convert text to speech using gTTS."""
        filename = "output.mp3"
        tts = gtts.gTTS(text)
        tts.save(filename)
        playsound.playsound(filename)
        os.remove(filename)

    def get_user_input(self, prompt: str) -> str:
        """Get user input via voice first; if unsuccessful, fall back to text input."""
        print(f"Assistant: {prompt}")
        self.text_to_speech(prompt)

        with sr.Microphone(device_index=0) as source:
            print("Listening... (speak now)")
            self.recognizer.adjust_for_ambient_noise(source)

            try:
                audio = self.recognizer.listen(source, timeout=5)
                user_input = self.recognizer.recognize_google(audio).strip()
                print(f"User: {user_input}")
                return user_input
            except sr.UnknownValueError:
                print("Couldn't understand. Switching to text input.")
            except sr.RequestError:
                print("Voice recognition error. Switching to text input.")
            except sr.WaitTimeoutError:
                print("No response detected. Switching to text input.")

        user_input = input("Type your response: ").strip()
        print(f"User: {user_input}")
        return user_input
    
    def get_valid_date(self, prompt: str) -> str:
        """Ensure user inputs a valid date format (YYYY-MM-DD)."""
        while True:
            user_input = self.get_user_input(prompt)
            try:
                date_transform = self.gemini.generate_content(
                    f"Return this user input {user_input} as a valid output in this date format: %Y-%m-%d"
                ).text
                valid_date = datetime.strptime(date_transform, "%Y-%m-%d").strftime("%Y-%m-%d")
                return valid_date
            except ValueError:
                print("Invalid date format. Please enter again (YYYY-MM-DD).")
                self.text_to_speech("Invalid date format. Please enter again.")
    
    async def collect_return_info(self):
        """Interact with user to collect return details."""       
        order_id = self.get_user_input("Please provide your order ID.")
        customer_name = self.get_user_input("Your name?")
        customer_contact = self.get_user_input("Your contact info?")
        product_name = self.get_user_input("Product name?")
        product_details = {
            "Size": self.get_user_input("Product size?"),
            "Colour": self.get_user_input("Product colour?"),
            "SKU": self.get_user_input("Product SKU?"),
            "Category": self.get_user_input("Product category?"),
            "Price": self.get_user_input("Product price?")
        }
        date_of_purchase = self.get_valid_date("Purchase date?") 
        date_of_return = datetime.now().strftime("%Y-%m-%d")
        return_reason = self.get_user_input("Return reason? (Didn't fit, defective, changed mind, wardrobing)")
        
        user_notes = self.get_user_input("Any notes on the product condition?")
        
        photos = []  # Placeholder for photo uploads
        self.text_to_speech("If you have photos of the product, please upload them via the app.")
        
        return_data = {
            "order_id": order_id,
            "customer_name": customer_name,
            "customer_contact": customer_contact,
            "product_name": product_name,
            "product_details": product_details,
            "date_of_purchase": date_of_purchase,
            "date_of_return": date_of_return,
            "return_reason": return_reason,
            "photos": photos,
            "user_submitted_notes": user_notes
        }
        
        return_id = await self.firebase_client.save_return_request(return_data)
        print(f"Assistent: Your return request has been submitted. Your return ID is {return_id}. It will be reviewed shortly.")
        self.text_to_speech(f"Your return request has been submitted. Your return ID is {return_id}. It will be reviewed shortly.")
    
    async def run(self):
        """Main assistant loop."""
        recycling_message = self.gemini.generate_content(
            "Short greeting and educate the user on the importance of responsible returns and recycling, keeping it short and engaging. Do not use any emoji."
        ).text
        print("Assistent: ", recycling_message)
        self.text_to_speech(recycling_message)
        start_return = self.get_user_input("Do you want to start a return? Say 'yes' to begin.")
        if start_return.lower() in ["yes", "yeah", "sure"]:
            await self.collect_return_info()
        else:
            self.text_to_speech("Okay, let me know if you need help in the future.")

if __name__ == "__main__":
    assistant = VoiceAssistant()
    asyncio.run(assistant.run())