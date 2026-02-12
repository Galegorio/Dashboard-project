from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENWEATHER_KEY = os.getenv("OPENWEATHER_KEY")


@app.get("/")
def home():
    return {"status": "API Online"}


# ================= CLIMA =================

@app.get("/weather/{city}")
def get_weather(city: str):

    if not OPENWEATHER_KEY:
        return {"error": "API Key não configurada"}

    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "q": city,
        "appid": OPENWEATHER_KEY,
        "units": "metric",
        "lang": "pt_br"
    }

    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        return res.json()

    except Exception:
        return {"error": "Erro ao buscar clima"}


# ================= CRIPTO =================

@app.get("/crypto")
def get_crypto():

    url = "https://api.coingecko.com/api/v3/simple/price"

    params = {
        "ids": "bitcoin,ethereum,tether,ripple,binancecoin",
        "vs_currencies": "brl",
        "include_24hr_change": "true"
    }

    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        return res.json()

    except Exception:

        return {
            "bitcoin": {"brl": 0, "brl_24h_change": 0},
            "ethereum": {"brl": 0, "brl_24h_change": 0},
            "tether": {"brl": 0, "brl_24h_change": 0},
            "ripple": {"brl": 0, "brl_24h_change": 0},
            "binancecoin": {"brl": 0, "brl_24h_change": 0}
        }


@app.get("/crypto/history/{coin}")
def get_history(coin: str):

    url = f"https://api.coingecko.com/api/v3/coins/{coin}/market_chart"

    params = {
        "vs_currency": "brl",
        "days": 7
    }

    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()

        data = res.json()

        prices = [p[1] for p in data["prices"]]

        return prices

    except Exception:
        return []
