import http.server
import socketserver
from urllib.parse import urlparse
from urllib.parse import parse_qs
from urllib import parse
import os
import json
import sys
sys.path.insert(1,"../requete_and_BA")
import requetes as requetes


mimetypes = { ".jpg" : "image/jpg", ".jpeg" : "image/jpeg", ".png" : "image/png", "html" : "text/html",
               ".js" : "application/javascript", ".css" : "text/css" , "json" : "application/json"}

#dictionnaire qui associe à chaque URL (relatif) une fonction retournant un string & le mimetype correspondant à la réponse
handlers = {}

jsonexample_res={"place_country":"Mexico","text":"Feliz año nuevo! Happy new year! #2019 @ Nuevo Laredo, Tamaulipas https://t.co/dVMk1Pl7Et"}
#fonction d'initialisation, appelée au lancement du serveur
def init():
    #ici, affecter à chaque chemin absolue
    handlers["/"] = main_handler
    handlers["/request_tweet"] = request_tweet

#réponse pour le chemin "/"
def main_handler(serv):
    #juste un test, on retourne le fichier ./index.html
    f = open(os.getcwd()+"/Client/Html/index.html")
    s = f.read()
    f.close()
    
    return s, mimetypes["html"]



def request_tweet(serv):
    name=""
    if 'name' in serv.my_params:
        name = serv.my_params["name"][0]
    words=""
    if 'words' in serv.my_params:
        words = serv.my_params["words"][0]
    date_start=""
    if 'date_start' in serv.my_params:
        date_start = serv.my_params["date_start"][0]
    date_end=""
    if 'date_end' in serv.my_params:
        date_end = serv.my_params["date_end"][0]
    country=""
    if 'country' in serv.my_params:
        country = serv.my_params["country"][0]

    res= requetes.request_tweet(words=words,name_country=country)
    return json.dumps(res), mimetypes["json"]


init()
