Nous avons besoin de ubuntu 
Pour lancer les installations:
1°)Dans un terminale se rendre sur le repertoire PostProjetLD
2°)executez la commande suivante : chmod a+x install.sh tests.sh

Pour le lancement des test nous avons besoin de Mozilla déjà installé et de firefox webdriver
Il faut avoir le port 8000 libre 

Selon votre architecture d'ordinateur 32 bits ou 64 bits veuillez deplacer geckodriver dans PostProjetLD/testpy/ .
Pour cela:
1°)Dans un terminale se rendre sur le repertoire PostProjetLD
2°)executez la commande suivante : mv 32bit/geckodriver testpy/ ou si c'est 64bits mv 64bit/geckodriver testpy/

3°)executez la commande suivante pour lancer les tests : ./tests.sh


Source : https://github.com/mozilla/geckodriver/releases
