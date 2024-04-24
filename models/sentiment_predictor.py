from utils.logger import Logger
from config.sentiment_cfg import TextVectorConfig, SentimentDataConfig
from models.sentiment_model import standardize, PositionalEncoding

import sys
import tensorflow as tf
import spacy
import pickle
import numpy as np
import pandas as pd
import io
import datetime
import base64

from nltk.corpus import words
from tensorflow.keras.layers import TextVectorization # type: ignore
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))


LOGGER = Logger(__file__, log_file="predictor.log")
LOGGER.log.info("Starting Model Serving")


class Predictor:
    def __init__(self, model_weight, device="cpu") -> None:
        self.model_weight = model_weight
        self.device = device
        self.load_model()
        
        self.lemmatizer = spacy.load("en_core_web_sm")
        self.en_vocab = set(words.words())
        
        with open(TextVectorConfig.TEXT_VECTOR_PATH, "rb") as file:
            data = pickle.load(file)
        
        vocab = data["topic-sentiment-vec-weights"][0]

        self.vector_layer = TextVectorization(
            standardize=standardize,
            max_tokens=30000,
            output_mode='int',
            output_sequence_length=SentimentDataConfig.SEQUENCE_LENGTH,
            pad_to_max_tokens=True,
            vocabulary=vocab
        )

    
    def load_model(self):
        if self.device == "cuda":
            gpus = tf.config.list_physical_devices('GPU')
            print("Num of GPUS: ", len(gpus))
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
        
        try:
            self.model = tf.keras.models.load_model(
                self.model_weight, 
                compile=False, 
                custom_objects={"PositionalEncoding": PositionalEncoding})

        except Exception as e:
            LOGGER.log.error(f"Load model failed")
            LOGGER.log.error(f"Error: {e}")
            
            return None
    
    
    async def get_data(self, request):
        file_data = await request.json()
        file_data = file_data["file"]
        file_data = file_data.partition(",")[2]
        file = base64.b64decode(file_data).decode('utf-8')
        str_data = io.StringIO(file)
        df = pd.read_csv(str_data, sep=",")
        return df
        
    
    async def model_inference(self, reviews):
        results = self.model.predict(reviews)
        
        return results
    
    
    async def predict(self, request):
        df = await self.get_data(request=request)
        reviews = list(df["review"])
        
        try: 
            dates = list(df["Date"])
            dates = [int(datetime.strptime(date, "%m/%d/%Y").timestamp()) 
                         for date in dates]
        except:
            current_time = int(datetime.datetime.now().timestamp())
            dates = [current_time + 86400 * i for i in range(len(reviews))]
                
        text_vecs = list(map(self.preprocessing, reviews))
        
        text_vecs = tf.reshape(
            text_vecs, shape=(len(text_vecs), SentimentDataConfig.SEQUENCE_LENGTH))
        
        outputs = await self.model_inference(text_vecs)
        
        _, class_ids = self.output2pred(outputs)
        
        tf.keras.backend.clear_session()
        
        results_dict = self.process_ouput(dates=dates, class_ids=class_ids)
        
        return results_dict
    
    
    def preprocessing(self, text):
        doc = self.lemmatizer(text.lower())
        tokens = [token.lemma_ for token in doc]
        
        filter_token = []
        for token in tokens:
            if token in self.en_vocab:
                filter_token.append(token)
                
        new_text = " ".join(filter_token)
        
        new_text = self.vector_layer(new_text)
        
        if np.array_equal([], new_text):
            new_text = tf.Variable(
                [0] * SentimentDataConfig.SEQUENCE_LENGTH, 
                dtype=tf.int64)
        
        new_text = tf.reshape(new_text, [1, SentimentDataConfig.SEQUENCE_LENGTH])
        
        return new_text

        
    def output2pred(self, outputs):
        sentiment_probs, topic_probs = outputs
        topic_ids = np.argmax(topic_probs, axis=1)
        sentiment_ids = np.argmax(sentiment_probs, axis=1)
        
        topic_labels = list(map(SentimentDataConfig.ID2LABEL_1.get, topic_ids))
        sentiment_labels = list(map(SentimentDataConfig.ID2LABEL_2.get, sentiment_ids))
        
        return (topic_probs.tolist(), sentiment_probs.tolist()), \
                (topic_labels, sentiment_labels)


    def process_ouput(self, dates, class_ids):
        results = {
            "Fashion": {
                "pos": [0] * len(dates),
                "neg": [0] * len(dates),
                "date": dates
                },
            "Food": {
                "pos": [0] * len(dates),
                "neg": [0] * len(dates),
                "date": dates
                },
            "Film": {
                "pos": [0] * len(dates),
                "neg": [0] * len(dates),
                "date": dates
            }
        }
        
        topics, sentiments = class_ids
        
        for date, topic, sentiment in zip(dates, topics, sentiments):
            index = dates.index(date)
            results[topic][sentiment][index] += 1
        
        return results
    