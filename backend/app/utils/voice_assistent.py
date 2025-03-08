import os
import json
import speech_recognition as sr
import asyncio
import gtts
import playsound
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class VoiceAssistant:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise Exception("GOOGLE_API_KEY environment variable not set")
        genai.configure(api_key=api_key)
        self.gemini = genai.GenerativeModel('gemini-2.0-flash')
        self.recognizer = sr.Recognizer()

    def recognize_speech(self) -> str:
        """Capture and convert voice to text."""
        with sr.Microphone() as source:
            print("Listening... Speak now!")
            self.recognizer.adjust_for_ambient_noise(source)
            audio = self.recognizer.listen(source)
        
        try:
            text = self.recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text
        except sr.UnknownValueError:
            print("Sorry, I couldn't understand you.")
        except sr.RequestError:
            print("Speech Recognition service error.")
        return None

    def text_to_speech(self, text: str, method: str = "gtts"):
        """Convert text to speech using gTTS."""
        filename = "output.mp3"
        tts = gtts.gTTS(text)
        tts.save(filename)
        playsound.playsound(filename)
        os.remove(filename)

    async def run(self):
        """Main function to run the voice assistant."""
        print("Choose input mode:\n1. Voice\n2. Text")
        mode = input("Enter 1 or 2: ").strip()

        if mode == "1":
            user_input = self.recognize_speech()
        else:
            user_input = input("Enter your text: ")

        if user_input:

            try:
                # Direct call to Gemini API
                response = self.gemini.generate_content(user_input)
                ai_response = response.text.strip()  # Extract the AI response text
                if not ai_response:
                    ai_response = "AI did not respond."

                print(f"Assistent: {ai_response}")

                # Convert the response to speech
                self.text_to_speech(ai_response)  # Convert the raw AI response to speech

            except Exception as e:
                print(f"Error generating response from Gemini: {e}")
                self.text_to_speech("Sorry, there was an error generating the response.")

if __name__ == "__main__":
    assistant = VoiceAssistant()
    asyncio.run(assistant.run())