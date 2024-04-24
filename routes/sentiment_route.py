from schemas import TotalPrediction, DemoPrediction
from config.sentiment_cfg import ModelConfig, SentimentDataConfig
from models.sentiment_predictor import Predictor

import sys
import io
import pandas as pd
import tensorflow as tf

from fastapi import APIRouter, Request, UploadFile
from fastapi.encoders import jsonable_encoder
from pathlib import Path


sys.path.append(str(Path(__file__).parent))
router = APIRouter()
predictor = Predictor(
    model_weight=ModelConfig.MODEL_WEIGHT,
    device="cuda"
)


@router.post("/predict")
async def predict(request: Request):
    response = await predictor.predict(request)
    results = TotalPrediction(status_code=200, predict=response)
    
    return jsonable_encoder(results)


@router.post("/demo_predict")
async def demo_predict(file_upload: UploadFile):
    data = file_upload.file.read()
    
    data = data.decode("utf-8")
    
    str_data = io.StringIO(data)
    
    df = pd.read_csv(str_data, sep=",")
    
    reviews = list(df["review"])
    
    text_vecs = list(map(predictor.preprocessing, reviews))
    text_vecs = tf.reshape(
        text_vecs, shape=(len(text_vecs), SentimentDataConfig.SEQUENCE_LENGTH))
    
    results = await predictor.model_inference(text_vecs)
    
    probs, class_ids = predictor.output2pred(results)
    
    results = {"probs": probs, "class_ids": class_ids}
    
    return DemoPrediction(**results)
