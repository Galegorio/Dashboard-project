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

# ================= CLIMA =================

OPENWEATHER_KEY = os.getenv("OPENWEATHER_KEY")


@app.get("/")
def home():
    return {"status": "API Online"}


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

    except:
        return {"error": "Erro ao buscar clima"}


# ================= CRIPTO =================

COINGECKO = "https://api.coingecko.com/api/v3"


@app.get("/crypto/top5")
def get_top5():

    url = f"{COINGECKO}/coins/markets"

    params = {
        "vs_currency": "brl",
        "order": "market_cap_desc",
        "per_page": 5,
        "page": 1,
        "sparkline": False,
        "price_change_percentage": "24h"
    }

    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()

        coins = res.json()

        result = []

        for c in coins:
            result.append({
                "id": c["id"],
                "name": c["name"],
                "symbol": c["symbol"].upper(),
                "image": c["image"],
                "price": round(c["current_price"], 2),
                "change": round(c["price_change_percentage_24h"], 2),
                "rank": c["market_cap_rank"]
            })

        return result

    except Exception as e:
        return {"error": str(e)}


@app.get("/crypto/details/{coin_id}")
def get_crypto_details(coin_id: str):

    try:
        url = f"https://api.coingecko.com/api/v3/coins/{coin_id}"

        res = requests.get(url, params={
            "localization": "false",
            "tickers": "false",
            "market_data": "true",
            "community_data": "false",
            "developer_data": "false",
            "sparkline": "false"
        }, timeout=10)

        res.raise_for_status()

        data = res.json()

        # Histórico separado (7 dias)
        history_url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"

        history_res = requests.get(history_url, params={
            "vs_currency": "brl",
            "days": 7
        }, timeout=10)

        history_res.raise_for_status()

        history_data = history_res.json()

        prices = [p[1] for p in history_data["prices"]]

        return {
            "id": data["id"],
            "name": data["name"],
            "symbol": data["symbol"],
            "image": data["image"]["large"],
            "price": data["market_data"]["current_price"]["brl"],
            "change": data["market_data"]["price_change_percentage_24h"],
            "rank": data["market_cap_rank"],
            "history": prices
        }

    except Exception as e:
        print("Erro crypto:", e)

        return {
            "error": str(e)
        }
