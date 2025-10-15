import pandas as pd 
import numpy as np 
from typing import Dict , List , Union 
import json 

class Gestion_Valeurs_Manquantes:
    def __init__(self , df:pd.DataFrame):
        self.df = df.copy()
        self.original_shape = df.shape 
    
    