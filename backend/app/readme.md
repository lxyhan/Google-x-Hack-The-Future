# Backend Setup and Running Guide

This document provides instructions on how to set up and run the backend of the project, including testing services, running voice assistant functionality, and configuring environment variables.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Backend](#running-the-backend)
- [Running Tests](#running-tests)
- [Voice Assistant Functionality](#voice-assistant-functionality)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Additional Notes](#additional-notes)

## Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.x (preferably Python 3.8 or later)
- pip (Python package installer)
- A virtual environment (optional but recommended)

## Setup Instructions

### 1. Create a Virtual Environment (Optional but Recommended)

To create a virtual environment for your project:
```bash
python3 -m venv venv
```

### 2. Activate the Virtual Environment

- On Windows:
  ```bash
  .\venv\Scripts\activate
  ```
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies

Install the necessary Python dependencies using `pip`:
```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

The project uses environment variables for sensitive information like API keys and Firebase credentials.

1. Copy the `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file in a text editor and replace the placeholders with your actual credentials:
   ```bash
   GOOGLE_API_KEY=your-gemini-api-key
   FIREBASE_CREDENTIALS=path/to/your/firebase_credentials.json
   ```
   - Replace `your-gemini-api-key` with your actual Gemini API key.
   - Replace `path/to/your/firebase_credentials.json` with the path to your Firebase credentials JSON file.

## Running the Backend

### 1. Start the Application

To start the backend server (assuming you use a Python-based server like Flask, FastAPI, etc.), run:
```bash
python main.py
```

This will start the server, and you should be able to access the backend locally at `http://localhost:8000` (or another port depending on your configuration).

## Running Tests

To test the services and verify the functionality of your backend:

1. Run tests for services:
   ```bash
   python run_tests.py
   ```

   This will execute the functions in the `services` directory (e.g., `defect_detection.py`, `fraud_detection.py`, and `return_detection.py`).

2. Ensure that the test image (`test_image.png`) is in place, as it may be required for the tests.

## Voice Assistant Functionality

To perform a customer return process through a voice agent that can automatically store user information in the Firebase database:

1. Navigate to the `utils` directory:
   ```bash
   cd utils
   ```

2. Run the voice assistant script:
   ```bash
   python voice_assistent.py
   ```

   This will trigger the customer return process, interact with the voice agent, and store information into Firebase as specified in the code.

## File Structure

Here’s a breakdown of the project structure:

```
app/
  ├── model/
  │    └── schemas.py              # Database schemas and models
  ├── services/
  │    ├── defect_detection.py     # Defect detection logic
  │    ├── fraud_detection.py      # Fraud detection logic
  │    └── return_detection.py     # Return detection logic
utils/
  ├── gemini_client.py             # Gemini API client
  ├── firebase_client.py           # Firebase client for database operations
  └── voice_assistent.py           # Voice assistant script for customer returns
config.py                          # Configuration settings
main.py                            # Main entry point for the backend server
requirements.txt                  # Python dependencies
run_tests.py                       # Script for running tests on services
test_image.png                     # Example image for testing
package-lock.json                  # Lock file for npm dependencies (if applicable)
package.json                       # npm package configurations (if applicable)
.env.example                       # Template file for environment variables
```

## Troubleshooting

- **Missing dependencies:** Make sure you've run `pip install -r requirements.txt` to install all required packages.
- **Environment variable issues:** Double-check the `.env` file and ensure all necessary environment variables are set.
- **Port already in use:** If the default port is in use, you can specify a different port in your backend setup (e.g., `python main.py --port 5000`).

## Additional Notes

- Make sure your Firebase credentials file (`firebase_credentials.json`) is properly configured for connecting to your Firebase database.
- If you're using any cloud-based services (like Gemini API), ensure that the API keys and tokens are valid.
- If running in a production environment, ensure you have proper security measures such as API rate-limiting and HTTPS for secure communication.