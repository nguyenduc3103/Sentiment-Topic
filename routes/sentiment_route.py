import sys

from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder

from schemas import TotalPredication
from config.sentiment_cfg import ModelConfig
from models.sentiment_predictor import Predictor


router = APIRouter()
predictor = Predictor(
    model_weight=ModelConfig.MODEL_WEIGHT,
    device="cuda"
)

@router.post("/predict")
async def predict(request: Request):
    response = await predictor.predict(request)
    results = TotalPredication(status_code=200, predict=response)
    
    return jsonable_encoder(results)
