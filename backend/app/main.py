from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import math
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

# For development, we allow all origins.
# In production, this should be restricted to the frontend's domain.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_nan_values(data):
    if isinstance(data, dict):
        return {k: clean_nan_values(v) for k, v in data.items()}
    if isinstance(data, list):
        return [clean_nan_values(i) for i in data]
    if isinstance(data, float) and math.isnan(data):
        return None
    return data

@app.get("/")
async def read_root():
    # In a real application, the token should be stored securely, e.g., in an environment variable.
    headers = {
        "Authorization": "Bearer test",
        "Content-Type": "application/json"
    }
    params = {
        "suburb": "Belmont North",
        "property_type": "house"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.microburbs.com.au/report_generator/api/suburb/properties",
            params=params,
            headers=headers
        )
        response.raise_for_status()
        data = response.json()
        logging.info(f"Data from external API: {data}")
        cleaned_data = clean_nan_values(data)
        logging.info(f"Cleaned data: {cleaned_data}")
        return cleaned_data
