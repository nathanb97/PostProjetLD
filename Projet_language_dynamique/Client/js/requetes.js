var MediaTweet = {};

//fonction qui permet d'attribuer une limite de temps à une promesse spécifier en parametre
const timeoutPromise = function(ms, promise){

  // Creer une promesse qui est rejeter au bout de ms en millisecondes
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in '+ ms + 'ms.')
    }, ms)
  })

  // race retourne la promesse qui se manifeste en premier CAD qui retourne soit un resolve ou un reject
  return Promise.race([
    promise,
    timeout
  ])
}

//fonction qui interroge un serveur a l'adresse donnée et une méthode spécifié et renvoie une promesse
MediaTweet.ajax = function (method, url) {
    return new Promise ((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange",  function () {
            /* quand la requête change à l'état 'terminé' */
            if (this.readyState == 4) {
                if (this.status == 200)
                    resolve(this.responseText);
                else
                    reject(this.status + " : " + this.responseText);
            }
        });

        /* on commence la requête HTTP */
        xhr.open(method, url);
        /* on définit quelques en-têtes */
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8"); // type de retour
        /* on envoie la requête */
        xhr.send();
    })
};

//Ici nous demandons notre requetes qui renvoie le resumé de tweet
MediaTweet.query = async function (params) {
    let paramString = "";
    let cpt=0
    for (var p in params) {
        /* on itère sur toutes les clés de 'params' (qui ne sont pas dans son prototype)
           pour construire la requête
        */
        if (params.hasOwnProperty (p)) {
            if(cpt>0){
                paramString += "&" + p + "=" + encodeURIComponent(params[p]);

            }else{
                paramString += "?" + p + "=" + encodeURIComponent(params[p]);
            }
            cpt+=1
        };
    };
    let url = "http://localhost:8000/request_tweet"
        + paramString;
    try{
        res = await timeoutPromise(8000,MediaTweet.ajax("GET", url));
        return JSON.parse(res);
    //en cas d'echec de connection on vas la 
    }catch(str){
        alert("Probleme de connection veuillez reesayer ulterieurement")
        res =str
    }
    return res;
};

