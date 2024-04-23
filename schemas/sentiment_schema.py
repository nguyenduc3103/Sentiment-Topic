import os
import sys
from pydantic import BaseModel


__dir__ = os.path.dirname(os.path.abspath(__file__))
sys.path.append(__dir__)
sys.path.insert(0, os.path.abspath(os.path.join(__dir__, '..')))


class CategoryPrediction(BaseModel):
    pos: list[int]
    neg: list[int]
    date: list[int]
    

class TotalPredication(BaseModel):
    status_code: int
    predict: dict[str, CategoryPrediction]
    