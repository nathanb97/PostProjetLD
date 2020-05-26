let cal_rad=function(degres){
    return degres / (180/Math.PI);
}

let cal_position = function(lat, lon, map_coordinate){
    let x = map_coordinate.width * (lon + 180) / 360  -30;
    let y =Math.log(Math.tan(Math.PI/4 + cal_rad(lat)/2))
    y = map_coordinate.height/2 - map_coordinate.width* y / (2 * Math.PI);
    let dot = { x : x, y : y};
    return dot;
}


let good_dim = function(circle,left,top,width,height){
    //Je met la bonne position 
    circle.style.top = top+"px";
    circle.style.left = left+"px";

    circle.style.width = width+"px";
    circle.style.height = height+"px";

}

let creates_point=function(jason, map,map_div,tot){
    for (let i = 0; i < jason.length; i++) {
        create_point(jason[i]["latitude"], jason[i]["longitude"], (jason[i]["count"]/tot)*100, map,map_div,jason[i]["count"]);
    }
}


let create_point = function(lat, lon, size, map_coordinate,map_div,count){
    let pos = cal_position(lat, lon, map_coordinate);

    let pt = document.createElement("div");
    pt.className = "map_point";
    good_dim(pt, pos.x - size/3, pos.y - size/3, size, size);
    pt.style.lineHeight = pt.style.height;
    pt.innerHTML = count;
    map_div.appendChild(pt);
}
