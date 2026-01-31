import os
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("WATSONX_API_KEY")
PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
BASE_URL = os.getenv("WATSONX_URL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ IAM TOKEN ------------------

def get_iam_token():
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "apikey": API_KEY,
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey"
    }

    res = requests.post(url, headers=headers, data=data)
    res.raise_for_status()
    return res.json()["access_token"]

# ------------------ API ------------------

@app.post("/api/orchestrate")
def orchestrate(payload: dict):
    alert = payload.get("alert", "")

    token = get_iam_token()

    url = f"{BASE_URL}/ml/v1/text/generation?version=2023-05-29"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    body = {
        "project_id": PROJECT_ID,
        "model_id": "ibm/granite-4-h-small",
        "input": f"""
You are an Enterprise Incident AI.

Return ONLY valid JSON.
Do NOT include markdown or explanations.

SCHEMA:
{{
  "detection": {{
    "severity": "HIGH|MEDIUM|LOW",
    "system": "string",
    "pattern": "string",
    "escalation": true
  }},
  "reasoning": {{
    "rootCause": "string",
    "risks": {{
      "revenue": "High|Medium|Low",
      "security": "High|Medium|Low",
      "operations": "High|Medium|Low"
    }}
  }},
  "action": {{
    "ticket": "string",
    "email": "string",
    "status": "string"
  }},
  "timeline": ["string", "string", "string", "string"]
}}

ALERT:
{alert}
""",
        "parameters": {
            "max_new_tokens": 600,
            "temperature": 0.1,
            "stop_sequences": ["}\n\n{"]
        }
    }

    response = requests.post(url, headers=headers, json=body)
    data = response.json()

    print("WATSONX RAW RESPONSE:", data)
    return data
