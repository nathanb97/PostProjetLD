#!/usr/bin/env python
# coding: utf-8

# In[1]:


# import que nous avons besoin:
import copy
import pandas as pd
import numpy as np
import re
import os
import math
import random
import sys
from threading import Thread
import time
import dist_levenstein
import json
pd.set_option('display.max_columns', None)
pd.set_option('max_colwidth',800)



# fonction general:
## fonction d'insertion dictionnaire
def insert_word(dic,word):
    word=word.lower()
    word=word.replace(".","")
    word=word.replace("!","")
    word=word.replace("\n","")
    word=word.replace("#","")
    word=word.replace("()","")
    word=word.replace(")","")
    word=word.replace(",","")
    word=word.replace("\"","")
    if word not in dic:
        dic[word]=1
    else:
        dic[word]+=1
## fonction de recomendation de mot en cas de faute d'ortographe 
def recommended_word(word):
    # On reduit le champ de recherche ou sinon trop long 
    tmp=datframe_word.loc[(datframe_word["word"].str.len()<=len(word)+1) & (datframe_word["word"].str.len()>=len(word)-1)]
    tmp["dist_levenstein"]=tmp["word"].apply(lambda x : dist_levenstein.DistanceDeLevenshtein(x.lower(),word.lower()))
    return list(tmp.loc[tmp["dist_levenstein"]<3].sort_values("dist_levenstein",ascending=1)["word"])    
## fonction de recomendation de pays en cas de faute d'ortographe
def recommended_country(country):
    tmp=country_for_leven.copy()
    tmp["dist_levenstein"]=tmp["country"].apply(lambda x : dist_levenstein.DistanceDeLevenshtein(x.lower(),country.lower()))
    return list(tmp.loc[tmp["dist_levenstein"]<3].sort_values("dist_levenstein",ascending=1)["country"])   






# Quelques variable globale
tweet = pd.read_csv('./tweets.csv', sep = ',') #Mon dataframe tweet
tweet["word"]=np.nan

liste_date=list(tweet["date"])
date_def=liste_date[int(len(liste_date)/2)]
date_def=date_def[:11]+re.sub(r'[0-9]',"0",date_def[11:]) #Une date aléatoire
                    
                    
#Un dataFrame de tous mes mots contenue dans tweet
dict_word={}
for i in tweet["text"]:
    for word in i.split(" "):
        insert_word(dict_word,word)
datframe_word=pd.DataFrame.from_dict(dict_word,orient="index",columns=["count_word"]).sort_values("count_word",ascending=0)
datframe_word['word']=datframe_word.index
datframe_word['dist_levenstein']=np.nan
datframe_word.index=[i for i in range(0,len(datframe_word))]
#Un dataFrame de tous mes pays contenue dans tweet
country_for_leven=pd.DataFrame((tweet["place_country"].unique()),columns=["country"]).dropna()
datframe_word['dist_levenstein']=np.nan
dict_word={}
word="hahpy"


# # Fonction for Javascript pour faire des requetes

# In[10]:


def tweet_by_name(name):
    return tweet[tweet["user_name"]==name].to_json()
def tweet_by_place_name(name):
    return tweet[tweet["place_name"]==name].to_json()
def tweet_by_id(name):
    return tweet[tweet["id"]==name].to_json()
def tweet_by_user_id(name):
    return tweet[tweet["user_id"]==name].to_json()
def search_by_word_only(res,word):
    res=res[res["text"].str.contains(r"\b"+word+r"\b",case=False)]
    tmp=tweet[tweet["text"].str.contains(r"\b"+word+r"\b",case=False)]
                                         
    if(len(tmp)==0):
        liste=recommended_word(word)
    else:
        liste=[]
    return res,liste
def search_by_word_or(word):
    tmp=tweet[tweet["text"].str.contains(r"\b"+word+r"\b",case=False)]
    tmp["word"]=word
    if(len(tmp)==0):
        liste=recommended_word(word)
    else:
        liste=[]
    return tmp,liste

def search_by_country(res,country):
    tmp=res[res["place_country"].str.contains(r"\b"+country+r"\b",case=False,na=False)]
    tmp["country"]=country
    verif=len(country_for_leven[country_for_leven["country"].str.contains(r"\b"+country+r"\b",case=False)])
    if(verif==0):
        liste=recommended_country(country)
    else:
        liste=[]
    return tmp,liste
#Cherche tweet après la date de la forme jj/mm/aaaa
def search_by_date1(res,date):
    #J'attribue la meme forme de date grace a date_def
    date_res=date[6:]+"-"+date[3:5]+"-"+date[:2]+'T'+date_def[11:]
    return res[res["date"]>date_res]
#Cherche tweet avant la date de la forme jj/mm/aaaa
def search_by_date2(res,date):
    #J'attribue la meme forme de date grace a date_def
    date_res=date[6:]+"-"+date[3:5]+"-"+date[:2]+'T'+date_def[11:]
    return res[res["date"]>date_res]

def get_union_hastag(res):
    liste=[]
    for i in range(0,3):
        union_hastag=res.copy()
        union_hastag[res.columns]
        union_hastag=union_hastag.drop(columns=["hashtag_"+str((i+1)%3),"hashtag_"+str((i+2)%3)])
        union_hastag=union_hastag.rename(columns={"hashtag_"+str(i):"hashtag"})
        liste.append(union_hastag)
    return pd.concat(liste,ignore_index=True)

def get_union_hahstag(res):
    liste=[]
    for i in range(0,3):
        union_hastag=res.copy()
        union_hastag[res.columns]
        union_hastag=union_hastag.drop(columns=["hashtag_"+str((i+1)%3),"hashtag_"+str((i+2)%3)])
        union_hastag=union_hastag.rename(columns={"hashtag_"+str(i):"hashtag"})
        liste.append(union_hastag)
    return pd.concat(liste,ignore_index=True).reset_index()
def search_by_serveral_word_or(words):
    listes_mot=words.split("_")
    dic_corrected=dict()
    find=False
    res=tweet
    cpt=0
    for i in range(0,len(listes_mot)):
        word=listes_mot[i]
        if(len(word)==0):
            continue
        tmp,l=search_by_word_or(word)
        if len(l)>0:
            dic_corrected[word]=l
        elif len(tmp)==0:
            True
        else:
            if(cpt>0):
                res=pd.concat([res, tmp], ignore_index=True)
                res.drop_duplicates(subset=["id"])
            else:
                res=tmp
                cpt+=1
            find=True
    return res,dic_corrected

def search_by_serveral_country(base,countrys):
    listes_mot=countrys.split("_")
    dic_corrected=dict()
    find=False
    res=base
    cpt=0
    for i in range(0,len(listes_mot)):
        country=listes_mot[i]
        if(len(country)==0):
            continue
        tmp,l=search_by_country(base,country)
        if len(l)>0:
            dic_corrected[country]=l
        elif len(tmp)==0:
            True
        else:
            if(cpt>0):
                res=pd.concat([res, tmp], ignore_index=True)
                res.drop_duplicates(subset=["id"])
            else:
                res=tmp
                cpt+=1
            find=True
    return res,dic_corrected

def request_tweet(words="",name_country="",date_start="",date_end=""):
    #Requetes mot:
    res,l=search_by_serveral_word_or(words)
    words=words.split("_")
    countrys=name_country.split("_")

    #Requetes pays
    reco_country={}
    if name_country!="":
        res,reco_country=search_by_serveral_country(res,name_country)
    #Requetes dates
    if date_start!="":
        res=search_by_date1(res,date_start)
    if date_end!="":
        res=search_by_date2(res,date_end)
    #Avoir le plus grand nombre de tweet par  pays :
    pays=res.groupby("place_country").count().sort_values("id",ascending=0)
    pays=pays[['id']].rename(columns={"id":"total_tweets"}).reset_index()
    pays["count_tweet_per_word"]=np.nan
    for country in pays["place_country"].unique():
        count_tweet_per_word=pd.DataFrame()
        for word in words:
            if(len(word)==0):
                continue
            count_tweet_per_word=count_tweet_per_word.append({"word":word,"count_tweet":len(res.loc[(res["place_country"]==country)&(res["word"]==word)])},ignore_index=True)
            #count_tweet_per_word.append({"word":word,"count_tweet":len(res[res["word"]]==word)},ignore_index=True)
        pays.loc[pays["place_country"]==country,"count_tweet_per_word"]=pays.loc[pays["place_country"]==country,"count_tweet_per_word"].apply(lambda x : count_tweet_per_word.to_dict(orient='records'))

    #Avoir le top 10 hashtag:
    union_hashtag=get_union_hastag(res).reset_index().groupby('hashtag').count().sort_values("index",ascending=0).iloc[0:10][["id"]].reset_index().rename(columns={"id":"count_hashtag"})
    #Avoir les longueur :
    latitude_longitude=pd.DataFrame()
    for word in words:
        how_co=len(res[res["word"]==word])
        if(how_co)==0:
            continue

        latitude_longitude=latitude_longitude.append({"word":word,"coordinations":res[res["word"]==word][["longitude","latitude"]].copy().to_dict(orient='records')},ignore_index=True)
    latitude_longitude_by_country=pd.DataFrame()
    try:
        for country in res["place_country"].unique():
            if(len(country)==0):
                countinue
            lat_lon=np.mean(res[res["place_country"]==country][["longitude","latitude"]])
            how_co=len(res[res["place_country"]==country])
            if(how_co)==0:
                continue
            latitude_longitude_by_country=latitude_longitude_by_country.append({"country":country,"longitude":lat_lon["longitude"],
                                                                                "latitude":lat_lon["latitude"],"count":how_co},ignore_index=True)
    except:
        print("grossee erreur je peux pas faire la map")
        True

    count_tweet=pd.DataFrame()
    count_tweet=count_tweet.append({"word_count":len(words),"totally_tweet_count":len(res),"tweets_per_country":pays.to_dict(orient="records"),"top_hashtags":union_hashtag.to_dict(orient="records"),"tweets_latitude_longitude":latitude_longitude.to_dict(orient="records"),"latitude_longitude_by_country":latitude_longitude_by_country.to_dict(orient="records"),"recommended_word":l,"recommended_country":reco_country},ignore_index=True)
    return count_tweet.to_dict(orient="records")


# In[16]:

