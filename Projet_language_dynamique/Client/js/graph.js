class graphe {
    constructor (options) {
        //ici je transmet le jason, le nom de la donnée Json et l'element
        this.jason = options.jason;
        this.name_column_jason = options.name_column_jason;
        this.name_column_jason_keep=options.name_column_jason_keep;
        this.element = options.element;
        //je lui donne l'element html
        this.graphe_element=document.getElementById(this.element)
        //je creer ma listes de colonne
        this.columns = new Array();
        this.to_draw = {};
        //nombre de columns
        this.count_columns = options.count_columns;
        this.total_count=0;
        this.refreshIntervalId=options.refreshIntervalId;
        this.element_total=document.getElementById(options.element_total);

        
        for (let i = 0; i < this.jason.length; i++) {
            if(i>=this.count_columns){
                break;
            }
            this.total_count=this.total_count+this.jason[i][this.name_column_jason_keep];
        }
        this.element_total.innerHTML="Tweets total: "+String(this.total_count);




    


        //je parcours le Jason pour savoir combien de colonne j'ai besoin
        for (let i = 0; i < this.jason.length; i++) {
            if(i>=this.count_columns){
                break
            }
            //je creer la div
            let div=document.createElement("div");
            div.setAttribute("class", "column");
            div.setAttribute("id", this.element+"_column_"+String(i));
            this.graphe_element.appendChild(div);

            //je creer le h4 nombre le count
            let h4=document.createElement("h4"); // nom de la balise
            let h4name="h4_"+this.element+"_"+String(i);
            h4.setAttribute("id", h4name);
            var text = document.createTextNode("0");
            h4.appendChild(text);
            div.appendChild(h4);


            //je creer le canvas qui trace le graphe
            let canvas=document.createElement("canvas"); 
            let canvasname = "canvas_"+this.element+"_"+String(i); // nom du canvas
            canvas.setAttribute("id", canvasname);
            div.appendChild(canvas);

            //je creer le h3 le nom du pays
            let h3=document.createElement("h3");
            let h3name="h3_"+this.element+"_"+String(i);
            h3.setAttribute("id", h3name);
            var text = document.createTextNode(this.jason[i][this.name_column_jason]+"--");
            h3.appendChild(text);
            div.appendChild(h3);

            options={
                div:div,
                h4name:h4name,
                canvasname:canvasname,
                h3name:h3name,
                total:this.jason[i][this.name_column_jason_keep],
                size_rect_max:canvas.height*(this.jason[i][this.name_column_jason_keep]/this.total_count),
                color:getRandomColor(),
                graphe:this,
                id:i
            }
            let col=new column(options);
            this.columns.push(col);
            this.to_draw[i]=col;

            




        }

    }
    draw= function(){
        //Je lui dis de tracer les rectangle

        for (var col in this.to_draw) {
            this.to_draw[col].draw()
            
        }
        if(Object.keys(this.to_draw).length === 0 && this.to_draw.constructor === Object){
            disable_graph_draw();

        }
    };


}

    




        

//chaque colonne aura la forme
/*
      <div class=column>
        <h4>40</h4>
        <canvas id="canvas1"></canvas>
        <h3>France</h3>
      </div>


*/

class column {
    constructor (options) {
        //ici je transmet le graphe et son id
        this.graphe=options.graphe;
        this.id=options.id;
        //ici je transmet le count
        this.total=options.total;
        //ici je transmet le div qui represente la column
        this.div=options.div;
        //ici je transmet le canvas avec le nom
        this.canvasname=options.canvasname;
        this.canvas = this.div.children[this.canvasname];
        this.ctx = this.canvas.getContext("2d");
        //Ici je met la taille maximum
        this.size_rect_max=options.size_rect_max;
        //Ici je met le nombre dans la balise h4
        this.h4name=options.h4name;
        this.h4 = this.div.children[this.h4name];
        //Ici je met la taille courant
        this.cpt=0;
        //Ici je met la couleur aleatoire
        this.color = options.color;
        this.ctx.fillStyle=this.color;
        //Ici je met le graphe
        this.graphe = options.graphe;


        
    
    }
    draw= function(){
        //Je lui dis de tracer le rectangle
        let tmp=this.canvas.height-this.cpt
        if(Number(this.h4["textContent"])+1>this.total){
            true;
        }else{
            let new_count=Number(this.h4["textContent"])+20
            if (new_count>this.total) {
                new_count=this.total
            }
            this.h4["textContent"]=new_count;

        }
        if(this.cpt>this.size_rect_max){
            true;
        }else{
            this.ctx.fillRect(0,tmp,this.canvas.width,this.canvas.height)
            this.cpt=this.cpt+1.6
        }
        if(Number(this.h4["textContent"])+1>this.total&& this.cpt>this.size_rect_max){
            delete this.graphe["to_draw"][this.id];
        }

    };

};


let canvas= document.getElementById("canvas1")


options={
    canvas:canvas,
    size_rect_max:30,
    color:getRandomColor(),
}



//context.font
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/*
function getRandomColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}
options={
    "element":"graphe_tweet_by_country",
    "jason":jason[0]["tweets_per_country"],
    "name_column_jason":"place_country",
    "name_column_jason_keep":"total_tweets",
    "total_count":jason[0]["totally_tweet_count"],
    "count_columns":4

}

gr= new graphe(options)
let call = function(){
    gr.draw();
}

var refreshIntervalId = setInterval(call, 1000 / 40);

*/
