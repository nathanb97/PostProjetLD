//desactive dessin graphe
let refreshIntervalId;
let disable_graph_draw=function(){
    clearInterval(refreshIntervalId);

}


//Permet de choisir entre different graphe
let disable={who:"map"}

let change_disable=function(){
    if (disable.who=="histogramme"){

        disable.who="map";
        disable.display_map.style.display = "none";
        disable.display_histogramme.style.display = "block";
        
        disable.button_display_histogramme.disabled = "disabled";
        disable.button_display_map.disabled = "";

    }else{
        disable.who="histogramme";
        disable.display_histogramme.style.display = "none";
        disable.display_map.style.display = "block";

        disable.button_display_map.disabled = "disabled";
        disable.button_display_histogramme.disabled = "";


    }
}

//Permet de Rajouter des pays en plus
let how_country=1
let add_country=function(){
    //je creer la div
    let liste_val_country = document.getElementById("liste_val_country");
    let div=document.createElement("div");
    div.setAttribute("id", "valcountry"+String(how_country));
    div.innerHTML="<label for='autocomplete'>Pays&#9734;</label><input  list='contry_list'><datalist id='contry_list'></datalist>  ";
    liste_val_country.appendChild(div);
    how_country+=1;

}












window.addEventListener("load", function () {

    //Pour Rajouter Balise autre pays:
    let butt_other_country = document.getElementById("other_country");
    butt_other_country.addEventListener("click", function (ev) {
        add_country();
    });



    //Pour selectionner ou deselectionner graphe 
    let display_map = document.getElementById("display_map");
    let button_display_map = document.getElementById("button_button_map");
    disable.display_map=display_map;
    disable.button_display_map=button_display_map;


    let display_histogramme = document.getElementById("display_histograme");
    let button_display_histogramme = document.getElementById("button_button_graphe");
    disable.display_histogramme=display_histogramme;
    disable.button_display_histogramme=button_display_histogramme;

    change_disable();

    disable.button_display_histogramme.addEventListener("click", function (ev) {
        change_disable();
    });
    disable.button_display_map.addEventListener("click", function (ev) {
        change_disable();
    });













    //Requetes pour la construction des graphes
    //fonction  principale de demande de resumer de tweet
    let searchWord = document.getElementById("searchWord");
    let country = document.getElementById("liste_val_country");
    let date_start = document.getElementById("date_start");
    let date_end = document.getElementById("date_end");
    let searchButton = document.getElementById("searchButton");
    let inQuery = false;

    searchButton.addEventListener("click", function (ev) {
        inQuery = true;
        searchButton.disabled = "disabled";
        let divResults = document.getElementById("searchResults");
        let graphe_tweet_by_country = document.getElementById("graphe_tweet_by_country");
        //je colecte les valeurs de tous les pays
        let country_value_tot=""
        for (var i = 0; i < country.children.length; i++) {
             country_value_tot+="_"+country.children[i].children[1].value;
        }
        //Je fais en sorte que quand all est remplie tous les pays seront selectionné
        if(country_value_tot.replace(/_/g,"").toLowerCase()==""||country_value_tot.replace("_","").toLowerCase()==""||country_value_tot.toLowerCase().split("_").includes("all")){
            country_value_tot="";
        }

        let resume_tweet = MediaTweet.query({"words":searchWord.value.replace(" ","_"),"country":country_value_tot,"date_start":date_start.value,"date_end":date_end.value});
        resume_tweet.then (function (response_resume) {
            let recommended_word = new Array()

            
            //correction erreur
            for (var p in response_resume[0]["recommended_word"]) {
                new_listeword=response_resume[0]["recommended_word"][p];
                for (let i = 0; i < new_listeword.length; i++) {
                    if (i==10){
                        break;
                    }
                    
                    recommended_word.push(new_listeword[i]);
                }
            }
            (function(browsers) {

                function addItems (list, container) {
                    list.forEach(function(item){
                    const option = document.createElement('option');
              
                    option.setAttribute('value', item);
                    container.appendChild(option);
                  });
                }
              
                addItems(recommended_word, browsers);
              }(document.getElementById('reccomended_word')));



            





            //Requetes pour la construction de la carte avec les points
            let map_div = document.getElementById("conteneur_map");
            let map = document.getElementById("ima_map");
            let conteneur_dot = document.getElementById("conteneur_dot");
            let map_coordinate=map.getBoundingClientRect();
            //let pt = create_point(49, 2, 50, map,map_div);

            
            


            conteneur_dot.innerHTML="";

            creates_point(response_resume[0]["latitude_longitude_by_country"],map,conteneur_dot,response_resume[0]["totally_tweet_count"])


            divResults.innerHTML = "";
            graphe_tweet_by_country.innerHTML  = "<div class=column><h3>Nombre de Tweets <i class='arrow right'></i></h3><h3 id='Tweet_Total'>Tweets total: </h3><div class='espace'></div><h3>nom des pays <i class='arrow right'></i></h3></div>";

            options={
                "element":"graphe_tweet_by_country",
                "jason":response_resume[0]["tweets_per_country"],
                "name_column_jason":"place_country",
                "name_column_jason_keep":"total_tweets",
                //"total_count":jason[0]["totally_tweet_count"],
                "count_columns":4000000000,
                refreshIntervalId:refreshIntervalId,
                "element_total":"Tweet_Total"
            }
            gr= new graphe(options);

            inQuery = false;
            searchButton.disabled = "";
            let call = function(){

                gr.draw();
            }

            














            refreshIntervalId = setInterval(call, 1000 / 40);





        }).catch(function(e) {
            searchButton.disabled = ""; // "zut !"
        });
    });

});

//liste deroulante suggestion mot et country

/*
Longue liste de tous les pays de la liste 
J'aurais pue l'importer de la manière suivante:

fetch("liste_country.txt")
.then( r => r.text())
.then( (arr) => {
        let varr =JSON.stringify(arr.split("\n"))
        });
en utilisant une promesse
*/
let lis_country = new Array("All",'Afghanistan','Albania','Alemanha','Alemania','Algeria','Algérie','Allemagne','Andorra','Angola','Anguilla','Antarctica','Antigua and Barbuda','Argentina','Armenia','Aruba','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belgique','Belgium','België','Benin','Bhutan','Bolivia','Bolivie','Bosnia and Herzegovina','Botswana','Brasil','Brasile','Brazil','Brunei','Brésil','Bulgaria','Burkina Faso','Burundi','Bélgica','Cambodia','Cameroon','Canada','Canadá','Cayman Islands','Chile','Chipre','Colombia','Congo','Costa Rica','Crna Gora','Croacia','Cuba','Cyprus','Czech Republic',"Côte d'Ivoire",'Danimarca','Danmark',"Democratic People's Republic of Korea (North Korea)",'Democratic Republic of Congo','Denmark','Deutschland','Djibouti','Dominica','Dominican Republic','Duitsland','Ecuador','Eesti','Egypt','Ehemalige jugoslawische Republik Mazedonien','El Salvador','Emiratos Árabes Unidos','Espagne','Espanha','Espanya','España','Estados Unidos','Etats-Unis','Ethiopia','Fiji','Finland','Former Yugoslav Republic of Macedonia','France','Francia','Frankreich','Frankrijk','Frankrike','França','French Guiana','French Polynesia','Gambia','Georgia','Germany','Ghana','Greece','Greenland','Grenada','Guadeloupe','Guam','Guatemala','Haiti','Hashemite Kingdom of Jordan','Holanda','Honduras','Hong Kong','Hrvatska','Hungary','Hungria','Iceland','Inde','India','Indonesia','Iraq','Ireland','Irlanda','Irlande','Islamic Republic of Iran','Islandia','Isle of Man','Israel','Italia','Italie','Italy','Itália','Ivory Coast','Jamaica','Japan','Japon','Japão','Japón','Jepang','Kanada','Kazakhstan','Kenya','Kingdom of Saudi Arabia','Koweït','Kuwait',"Lao People's Democratic Republic",'Latvia','Latvija','Lebanon','Lesotho','Liban','Lithuania','Luxembourg','Luxemburg','Macau','Madagascar','Magyarország','Malaisie','Malasia','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mexico','Mexiko','Mexique','Moldova','Monaco','Mongolia','Morocco','Myanmar','México','Namibia','Namibië','Nederland','Nepal','New Caledonia','New Zealand','Nicaragua','Nigeria','Norge','North Korea','Noruega','Norvegia','Norway','Nueva Zelanda','Nuova Zelanda','Oman','Oostenrijk','Pakistan','Panama','Panamá','Papua New Guinea','Paraguay',"People's Republic of China",'Peru','Poland','Polska','Polynésie Française','Portugal','Qatar','Regno Unito','Reino Unido','Reino de Marruecos','Republic of Belarus','Republic of Croatia','Republic of Korea','Republic of Mauritius','Republic of Mozambique','Republic of Serbia','Republic of Slovenia','Republic of the Philippines','Republika ng Pilipinas','República Checa','República Eslovaca','Romania','România','Royaume du Maroc','Royaume-Uni','Russia','Rwanda','République du Bénin','Rússia','Saint Barthélemy','Saint Lucia','Samoa','Schweiz','Senegal','Singapore','Sint Maarten','Slovak Republic','Slovenija','South Africa','Spagna','Spain','Spanien','Spanje','Srbija','Sri Lanka','Stati Uniti','Storbritannien','Suecia','Suisse','Suiza','Suomi','Suriname','Suíça','Sverige','Svizzera','Swaziland','Sweden','Switzerland','Syrian Arab Republic','Tailandia','Tailândia','Taiwan','Tanzania','Thailand','Thaïlande','The Netherlands','Trinidad and Tobago','Tunisia','Tunisie','Turchia','Turkey','Turks and Caicos Islands','Tyskland','Türkei','Türkiye','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguai','Uruguay','Uzbekistan','Vatican City','Venezuela','Vereinigte Arabische Emirate','Verenigde Staten','Vietnam','Việt Nam','Zambia','Zimbabwe','Österreich','Česká republika','Ελλάς','Беларусь','България','Россия','Украина','Україна','Япония','ישראל','الامارات العربية المتحدة','الجزائر','المملكة الأردنية الهاشمية','المملكة العربية السعودية','تونس','جمهوری اسلامی ایران','دولة الكويت','دولة قطر','سلطنة عمان','مصر','مملكة البحرين','پاکستان','भारत','ญี่ปุ่น','ประเทศไทย','ニュージーランド','中华人民共和国','台灣','新加坡','日本','香港','대한민국','일본');


//Fonction qui permet de faire une liste deroulante 
//de suggestion pour country
(function(browsers) {

    function addItems (list, container) {
        list.forEach(function(item){
        const option = document.createElement('option');
  
        option.setAttribute('value', item);
        container.appendChild(option);
      });
    }
  
    addItems(lis_country, browsers);
  }(document.getElementById('contry_list')));

