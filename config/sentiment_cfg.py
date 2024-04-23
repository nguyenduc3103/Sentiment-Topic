import sys

from pathlib import Path
from nltk.corpus import stopwords
sys.path.append(str(Path(__file__).parent))


class SentimentDataConfig:
    N_CLASSES = 2
    IMG_SIZE = 64
    SEQUENCE_LENGTH = 200
    
    ID2LABEL_1 = {0: "Fashion", 1: "Food", 2: "Film"}
    LABEL2ID_1 = {"Fashion": 0, "Food": 1, "Film": 2}
    
    ID2LABEL_2 = {0: "neg", 1: "pos"}
    LABEL2ID_2 = {"neg": 0, "pos": 1}


class ModelConfig:
    ROOT_DIR = Path(__file__).parent.parent
    MODEL_NAME = "Topic-Sentiment"
    MODEL_WEIGHT = ROOT_DIR / "models" / "weights" / "model.h5"
    
    
class TextVectorConfig:
    STOP_WORDS = set(stopwords.words('english'))
    STOP_WORDS.update(['subject', 'http', "im", "hes", "shes", "theyre"])
    STOP_WORDS.difference_update(
        set(["but", "aren'", "aren't", 'couldn', "couldn't", 'didn', "didn't", 
             'doesn', "doesn't", 'don', "don't", 'hadn', "hadn't", 'hasn', "hasn't", 
             "haven't", 'isn', "isn't", 'mightn', "mightn't", 'mustn', "mustn't", 
             'needn', "needn't", 'nor', 'not', 'shan', "shan't", 'shouldn', "shouldn't", 
             't', 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', 
             "wouldn't"]))
    
    ROOT_DIR = Path(__file__).parent.parent
    TEXT_VECTOR_PATH = ROOT_DIR / "models" / "weights" / "TopicSentiment.pickle"