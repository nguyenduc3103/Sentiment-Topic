from fastapi import APIRouter

from pathlib import Path

from .sentiment_route import router as sentiment_cls_route

# router = APIRouter()
# router.include_router(sentiment_cls_route, 
#                       prefix="/predict")
