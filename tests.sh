echo 'Lancement serveur'

. ../../../virtualenv/bin/activate

cd ../../../Projet_language_dynamique/Serveur_BA/Serveur/
python3 server.py 8000&
cd ../../../aide/installation/64bit/

CMDPID=$!

echo "Premier test je lance trois clients en meme temps avec des requetes mais la suite des requetes s'effectura sur une seule fenetre que vous devrez mettre en plein écran"
sleep 5

python testpy/Test1.py &
python testpy/Test1.py &
python testpy/Test1.py 

python testpy/Test3.py 


echo "$CMDPID"

sleep 2
kill "$CMDPID"
