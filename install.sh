if hash pip3 >/dev/null; then
        echo "pip3 déja installé"
	else
	echo " veuillez installer pip3 en tapant le mdp:"
   	 sudo apt-get install python3-pip
fi

if hash virtualenv >/dev/null; then
        echo "virtualenv déja installé"
	else
	echo " Installation virtualenv:"
   	 pip3 install virtualenv
fi

if hash firefox >/dev/null; then
        echo "firefox déja installé"
	else
	echo " Installation firefox:"
   	 sudo apt-get install firefox
fi




virtualenv virtualenv
. virtualenv/bin/activate
pip install -r requirements.txt

