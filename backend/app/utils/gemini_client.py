import os
import json
from typing import Union, List
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

class GeminiClient:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise Exception("GOOGLE_API_KEY environment variable not set")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    async def analyze_content(
        self, 
        prompt: str, 
        image: Union[Image.Image, None] = None,
        temperature: float = 0.7
    ) -> dict:
        try:
            if image:
                response = self.model.generate_content([prompt, image])
            else:
                response = self.model.generate_content(prompt)
            
            if response.text is None:
                return "{}"
            
            # Clean the response by stripping any extraneous characters
            cleaned_response = response.text.strip()

            # Find the first occurrence of '{' and the last occurrence of '}'
            start_index = cleaned_response.find('{')
            end_index = cleaned_response.rfind('}')

            # If both are found, extract the content between them
            if start_index != -1 and end_index != -1:
                cleaned_response = cleaned_response[start_index:end_index+1]
            else:
                print(f"Error: No valid JSON-like structure found in the response.")
                return {}
            
            # Attempt to parse the response text into a JSON object
            try:
                result_json = json.loads(cleaned_response)
            except json.JSONDecodeError as e:
                print(f"JSONDecodeError: Failed to decode. Response: {cleaned_response}")
                return {}  # Return an empty dictionary if parsing fails

            return result_json
        except Exception as e:
            print(f"Error in Gemini analysis: {str(e)}")
            return "{}"

    async def analyze_image(self, image, prompt):
        return await self.analyze_content(prompt, image) 