import tensorflow as tf
import numpy as np
import re
import string

from tensorflow.keras.layers import Layer, Dropout # type: ignore

from config.sentiment_cfg import TextVectorConfig, SentimentDataConfig


def standardize(text):
    lower = tf.strings.lower(text)
    tag_removal = tf.strings.regex_replace(lower,"<[^>]+>", "")
    punc_removal = tf.strings.regex_replace(tag_removal, 
                                            "[%s]"%re.escape(string.punctuation), "")
    digit_removal = tf.strings.regex_replace(punc_removal, 
                                             "[%s]"%re.escape(string.digits), "")
    stopword_removal = tf.strings.regex_replace(
        digit_removal, r'\b(' + r'|'.join(TextVectorConfig.STOP_WORDS) + r')\b\s*',"")
    
    return stopword_removal


class PositionalEncoding(Layer): 
    def __init__(self, num_hiddens, dropout, 
                 max_len=SentimentDataConfig.SEQUENCE_LENGTH, **kwargs):
        super().__init__()
        self.num_hiddens = num_hiddens
        self.dropout = dropout
        self.max_len = max_len
        self.dropout_layer = Dropout(dropout)
        
        self.P = np.zeros((1, max_len, num_hiddens))
        
        X = np.arange(max_len, dtype=np.float32).reshape(-1,1) / \
            np.power(10000, np.arange(0, num_hiddens, 2, dtype=np.float32) / num_hiddens)
        
        self.P[:, :, 0::2] = np.sin(X)
        self.P[:, :, 1::2] = np.cos(X)


    def call(self, X, **kwargs):
        X = X + self.P[:, :X.shape[1], :]
        
        return self.dropout_layer(X, **kwargs)
    