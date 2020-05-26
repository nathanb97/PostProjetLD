import http.server
import socketserver
from urllib.parse import urlparse
from urllib.parse import parse_qs
from urllib import parse
from os import curdir, sep
import os
import cgi
import time
mimetypes = { "jpg" : "image/jpg", "jpeg" : "image/jpeg", "png" : "image/png", "html" : "text/html",
               "js" : "application/javascript", "css" : "text/css", "json" : "application/json" }

#importer MyFiles.py qui sert à appeler une fonction selon l'URL visité
import MyFiles
import MyLinks
#importer MyLinks.py qui sert à appeler une fonction selon l'URL visité
from socketserver import ThreadingMixIn
import sys
import socket

web_dir = '../../'
os.chdir(web_dir)

class ThreadingHTTPServer(ThreadingMixIn,http.server.HTTPServer):
    pass

#classe du handler des requetes, dérive de SimpleHTTPRequestHandler
class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    #à la réception d'une requete GET
    def do_GET(self):
        self.my_params = parse_qs(urlparse(self.path).query)

        #parser l'URL
        path = parse.urlparse(self.path).path
        print("Path : ", path)
        #Nous verifions si on demande au serveur un fichier
        file, mimetype= MyFiles.verify_if_file(path)
        #si nous trouvons bien le fichier nous le retournons sinon on continue
        if file!=False:
            try:
                #On lit le fichier
                print("try to open",file)
                file_to_open = open(os.getcwd()+"/"+file,'rb')
                self.send_response(200)
                self.send_header('Content-type',mimetype)
                self.end_headers()
                self.wfile.write(file_to_open.read())
                file_to_open.close() 
            except Exception as e:# Sinon not found 404
                print("Fichier indisponible",e,"dans le iffile de serveur")
                self.send_error(404,'File Not Found %s' %file)
                #self.send_error(404,'File Not Found %s' %file)       
            return
        
        #si on a une fonction associée à l'URL reçu, on l'appelle
        if(path in MyLinks.handlers):
            #la fonction associée à ce URL dans MyLinks.py est appelée
            #elle va retourner le contenu de la réponse ainsi que le mimetype correspondant (html, json, ...)
            #passer 'self' en paramètre car il contient des informations importantes (?params=values... )
            html, mimetype= MyLinks.handlers[path](self)
            
            # Sending an '200 OK' response
            self.send_response(200)
            # Setting the header
            self.send_header("Content-type", mimetype)
            # Whenever using 'send_header', you also have to call 'end_headers'
            self.end_headers()
            
            
        #aucune fonction n'attend l'URL demandé -> 404 error
        else:
            self.send_response(404)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            html = f"<html><head></head><body><h1>Bad URL :(</h1></body></html>"
            
        # Writing the HTML contents with UTF-8
        self.wfile.write(bytes(html, "utf8"))

        return
    
    #à la réception d'une requete POST
    #pas encore rempli, mais on en aura besoin par la suite
    def do_POST(self):
        return 


def get_server(port=8000, next_attempts=0, serve_path=None):
    
    while next_attempts >= 0:

        try:
            httpd = ThreadingHTTPServer(("", port),MyHttpRequestHandler)
            return httpd
        except Exception as e:
            time.sleep(5)
            print(e)

def main(args=None):
    if args is None:
        args = sys.argv[1:]

    PORT = 8000
    if len(args)>0:
        PORT = int(args[-1])
    serve_path = '.'
    if len(args) > 1:
        serve_path = abspath(args[-2])

    httpd = get_server(port=PORT, serve_path=serve_path)

    print ("serving at port", PORT)
    httpd.serve_forever()

if __name__ == "__main__" :
    main()
