//URL ENDPOINTS
const API_KEY = "E83LFC5hFXEDnC6KbSjVge3k89s0q5dl";
const URL_SEARCH = "https://api.giphy.com/v1/gifs/search?";
const URL_TRENDING = "https://api.giphy.com/v1/gifs/trending?";
const URL_SUGERENCIAS = "https://api.giphy.com/v1/gifs/random?";
const URL_AUTOCOMPLETE = "https://api.giphy.com/v1/gifs/search/tags?";
const URL_SEARCH_BY_ID = "https://api.giphy.com/v1/gifs/";
//OBJETOS DEL DOM
let menuEstilos = document.getElementsByClassName("menu-estilos")[0];
let cartel = document.getElementsByClassName("cartel-oops")[0];
let botonMisGuifos = document.getElementById("mis-guifos");
let gridMisGuifos = document.getElementById("grid-mis-guifos");
let logo = document.getElementsByClassName("logo-claro")[0];
let botonModoClaro = document.getElementById("sailor-day");
let botonModoOscuro = document.getElementById("sailor-night");
let lupa = document.getElementById("lupa");
let cuadroDeBusqueda = document.getElementsByClassName("cuadro-buscar")[0];
let gridSugerencias = document.getElementsByClassName("grid-sugerencias")[0]
let tituloSugerencias = document.getElementsByClassName("sugerencias")[0];
let gridTendencias = document.getElementById("grid-tendencias");
let tituloTendencias = document.getElementsByClassName("texto-tendencias")[0];
let tituloMisGuifos = document.getElementsByClassName("titulo-mis-guifos")[0];
let gridResultados = document.getElementsByClassName("grid-resultados")[0];
let contenedorBusquedaPrevia = document.getElementsByClassName("contenedor-busqueda-previa")[0];
const POSIBLES_RESULTADOS = document.getElementsByClassName("posibles-result")[0];
let botonPosiblesResultados1 = POSIBLES_RESULTADOS.getElementsByTagName("button")[0];
let botonPosiblesResultados2 = POSIBLES_RESULTADOS.getElementsByTagName("button")[1];
let botonPosiblesResultados3 = POSIBLES_RESULTADOS.getElementsByTagName("button")[2];
const BOTON_SEARCH = document.getElementsByClassName("boton-buscar")[0];
const SEARCH = document.getElementById("search");
const BOTON_ESTILOS = document.getElementsByClassName("boton-elegir-tema")[0];
var stringUser = "";
var arrayBusquedaPrevia = [];
const PALABRAGIF = "GIF";
//FUNCIONES
const FUNCION_MENU_SHOW = ()=>{
        if(menuEstilos.className == "menu-estilos"){
            menuEstilos.classList.replace("menu-estilos", "menu-estilos-show")
            }else{
            menuEstilos.classList.replace("menu-estilos-show","menu-estilos")
        }
};
function botonSearchDisabled(){
    if(BOTON_SEARCH.disabled == true){
        if(localStorage.getItem("modoOscuro") == "false"){
            lupa.setAttribute("src", "/images/lupa_inactive.svg");
            }else{
                lupa.setAttribute("src", "/images/Combined-Shape.svg")
        }
    }
}
botonSearchDisabled();
function mostrarMisGuifos(){
    if(localStorage.getItem("misGifs") == null){
        cartel.style.setProperty("display", "block");
    }else{
        let misGifs = [];
        misGifs = JSON.parse(localStorage.getItem("misGifs"));
        misGifs.forEach(hacerFetchMisGuifos);
    }
}
function hacerFetchMisGuifos (element){
    fetch(URL_SEARCH_BY_ID + element +"?api_key=" + API_KEY )
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
    })
        .then((bodyEnJson)=>{
            displayMisGuifos(bodyEnJson.data);
            console.log(bodyEnJson)
        })
}
function displayMisGuifos(data){
    let gifResultado = document.createElement("img");
    let urlGif = document.createElement("a");
    urlGif.setAttribute("href", data.embed_url)
    urlGif.setAttribute("target", "_blank");
    gifResultado.setAttribute("src", data.images["fixed_height"].url)
    urlGif.appendChild(gifResultado)
    gridMisGuifos.appendChild(urlGif);
}
function autocompletar (){
    SEARCH.addEventListener("input",()=>{
        stringUser = SEARCH.value;
    })
    if(stringUser !== ""){
        BOTON_SEARCH.disabled = false;
        if(localStorage.getItem("modoOscuro") == "false"){
            lupa.setAttribute("src", "/images/lupa.svg");
            }else{
            lupa.setAttribute("src", "/images/lupa_light.svg");
            }
        fetch(URL_AUTOCOMPLETE + "api_key=" + API_KEY + "&q=" + stringUser )
        .then((response)=>{
            if(response.ok){
                return response.json();
            }
        })
            .then((responseEnJson)=>{
                POSIBLES_RESULTADOS.getElementsByTagName("button")[0].innerText = responseEnJson.data[1].name;
                POSIBLES_RESULTADOS.getElementsByTagName("button")[1].innerText = responseEnJson.data[2].name;
                POSIBLES_RESULTADOS.getElementsByTagName("button")[2].innerText = responseEnJson.data[3].name;
        })
    }else{
        BOTON_SEARCH.disabled = true; 
        if(localStorage.getItem("modoOscuro") == "false"){
            lupa.setAttribute("src", "/images/lupa_inactive.svg");
            }else{
                lupa.setAttribute("src", "/images/Combined-Shape.svg")
        }
    }};
const mostrarSugerencias = ()=>{
    if(SEARCH.value !== ""){
        POSIBLES_RESULTADOS.style.setProperty("display", "block")
    }else{
        POSIBLES_RESULTADOS.style.setProperty("display", "none")}
};
function buscarGif (){
    fetch(URL_SEARCH + "api_key=" + API_KEY + "&q=" + stringUser + "&limit=18")
        .then((response)=>{
            if(response.ok){
                return response.json();
            }
        })
        .then((bodyEnJson)=>{
            if(arrayBusquedaPrevia.length == 1){
            mostrarResultados(bodyEnJson.data);
            }else{
                mostrarResultadosNuevos(bodyEnJson.data);
            }
        })
};
function mostrarResultados (data){
    gridResultados.style.setProperty("display", "grid")
    for(i = 0; i < data.length; i++){
        let gifResultado = document.createElement("img");
        let divResultado = document.createElement("div");
        let divHashtags = document.createElement("div");
        let tituloGif = document.createElement("p");
        let tituloGifContenido =  data[i].title;
        let tituloGifFinal = tituloGifContenido.substring(0 , tituloGifContenido.indexOf(PALABRAGIF));
        let urlGif = document.createElement("a");
        urlGif.setAttribute("href", data[i].embed_url);
        urlGif.setAttribute("target","_blank");
        divResultado.setAttribute("class", "div-resultado");
        divHashtags.setAttribute("class", "hashtags-resultado");
        tituloGif.innerText = "#" + tituloGifFinal;
        gifResultado.setAttribute("src", data[i].images['fixed_height'].url);
        gifResultado.setAttribute("class", "gif-resultado");
        gifResultado.style.setProperty("height", "298px");
        if(gifResultado.width / gifResultado.height >= 1.6){
            urlGif.style.setProperty("grid-column", "auto / span 2")
            divResultado.style.setProperty("width", "596px");

        }else{
            divResultado.style.setProperty("width", "298px");
        }
        divHashtags.appendChild(tituloGif)
        divResultado.appendChild(gifResultado);
        urlGif.appendChild(divResultado)
        divResultado.appendChild(divHashtags);
        gridResultados.appendChild(urlGif);
    }
}
function mostrarResultadosNuevos (data){
    for (i = 0; i < data.length; i++){
        let gifResultadoPrevio = document.getElementsByClassName("gif-resultado")[i];
        gifResultadoPrevio.setAttribute("src", data[i].images["fixed_height"].url)
    }
};
function pushBusqueda (){
    arrayBusquedaPrevia.push(stringUser);
    let busquedaPrevia = document.createElement("button");
    busquedaPrevia.setAttribute("class", "busqueda-previa");
    busquedaPrevia.innerHTML = "#" + stringUser;
    busquedaPrevia.addEventListener("click", ()=>{
       let stringInterno = busquedaPrevia.innerText;
       stringFinal = stringInterno.substring(stringInterno.indexOf("#")+1, stringInterno.length);
       stringUser = stringFinal;
    })
    busquedaPrevia.addEventListener("click", buscarGif)
    busquedaPrevia.addEventListener("click", cambiarTitulo)
    contenedorBusquedaPrevia.appendChild(busquedaPrevia);
    document.body.appendChild(contenedorBusquedaPrevia)
};
function ocultarTendencias(){
    document.getElementById("grid-tendencias").style.setProperty("display", "none")
};
function ocultarAutocomplete (){
    POSIBLES_RESULTADOS.style.setProperty("display", "none");
};
function cambiarTitulo(){
    let tituloSugerencias = document.getElementsByClassName("sugerencias")[0]
    let textoSugerencias = tituloSugerencias.getElementsByTagName("p")[0]
    textoSugerencias.innerText = stringUser + " (resultados)"
};
function ocultarSugerencias(){
    document.getElementsByClassName("grid-sugerencias")[0].style.setProperty("display", "none")
};
function buscarSugerencias (){
    for ( i = 0; i < 12; i++) {
    fetch(URL_SUGERENCIAS + "api_key=" + API_KEY + "&q=happy")
        .then((response)=>{
            if(response.ok){
                return response.json();
            }
        })
        .then((bodyEnJson)=>{
            resultadoSugerencias(bodyEnJson.data)    
        });
    }
}
function resultadoSugerencias (data){
    let imagenSugerencia = document.createElement("img");
    let divSugerencia = document.createElement("div");
    let divTitulo = document.createElement("div");
    let tituloGif = document.createElement("p");
    let botonX = document.createElement("img");
    let anchorVerMas = document.createElement("a");
    let botonVerMas = document.createElement("div");
    let txtVerMas = document.createElement("p");
    let gridSugerencias = document.getElementsByClassName("grid-sugerencias")[0]
    let tituloGifContenido = data.title;
    let contenidoHashtag = tituloGifContenido.substring(0 , tituloGifContenido.indexOf(PALABRAGIF));
    divSugerencia.setAttribute("class", "div-sugerencia");
    divTitulo.setAttribute("class", "div-titulo-gif");
    botonX.setAttribute("class", "boton-x")
    botonX.setAttribute("src","/images/button3.svg")
    imagenSugerencia.setAttribute("src", data.images['fixed_height'].url);
    imagenSugerencia.setAttribute("class", "gif-sugerencia")
    botonVerMas.setAttribute("class", "boton-ver-mas");
    anchorVerMas.setAttribute("href", data.embed_url);
    anchorVerMas.setAttribute("target", "_blank");
    tituloGif.innerText = "#" + contenidoHashtag;
    txtVerMas.innerText = "Ver más...";
    divSugerencia.appendChild(imagenSugerencia);
    botonVerMas.appendChild(txtVerMas)
    anchorVerMas.appendChild(botonVerMas)
    divSugerencia.appendChild(anchorVerMas);
    divTitulo.appendChild(tituloGif)
    divTitulo.appendChild(botonX)
    divSugerencia.appendChild(divTitulo);
    gridSugerencias.appendChild(divSugerencia)
    botonX.addEventListener("click", ()=>{
        divSugerencia.style.setProperty("display", "none")
    })
}
buscarSugerencias();
fetch(URL_TRENDING +  "api_key=" + API_KEY + "&limit=12")
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
    })
    .then((bodyEnJson)=>{
        funcionTendencias(bodyEnJson.data);
    }
);
function funcionTendencias(data){
    for ( i = 0; i < data.length; i++) {
        let imagenTendencia = document.createElement("img");
        let divTendencia = document.createElement("div");
        let divHashtags = document.createElement("div");
        let tituloGif = document.createElement("p");
        let tituloGifContenido =  data[i].title;
        let tituloGifFinal = tituloGifContenido.substring(0 , tituloGifContenido.indexOf(PALABRAGIF));
        let urlGif = document.createElement("a");
        urlGif.setAttribute("href", data[i].embed_url);
        urlGif.setAttribute("target","_blank");
        divTendencia.setAttribute("class", "div-tendencia");
        divHashtags.setAttribute("class", "div-hashtags");
        tituloGif.innerText = "#" + tituloGifFinal;
        imagenTendencia.setAttribute("src", data[i].images['fixed_height'].url);
        imagenTendencia.style.setProperty("height", "298px");
        if(imagenTendencia.width / imagenTendencia.height >= 1.6){
            urlGif.style.setProperty("grid-column", "auto / span 2")
            divTendencia.style.setProperty("width", "596px");

        }else{
            divTendencia.style.setProperty("width", "298px");
        }
        divHashtags.appendChild(tituloGif)
        divTendencia.appendChild(imagenTendencia);
        urlGif.appendChild(divTendencia)
        divTendencia.appendChild(divHashtags);
        document.getElementById("grid-tendencias").appendChild(urlGif)
    }
};
function guardarThemeEnLocalStorage (){
    if (document.body.classList.contains("modoOscuro")){
        localStorage.setItem("modoOscuro", "true");
    }else {
        localStorage.setItem("modoOscuro", "false"); 
    }
};
function tomarThemeDeLocalStorage(){
    if(localStorage.getItem("modoOscuro") === "true"){
        document.body.classList.add("modoOscuro");
        logo.setAttribute("src", "/images/gifOF_logo_dark.png");
    }else{
        document.body.classList.remove("modoOscuro"); 
    }
}
tomarThemeDeLocalStorage();
//EVENT LISTENERS
botonModoOscuro.addEventListener("click", ()=>{
    document.body.setAttribute("class","modoOscuro");
    menuEstilos.setAttribute("class", "menu-estilos");
    logo.setAttribute("src", "/images/gifOF_logo_dark.png")
})
botonModoOscuro.addEventListener("click", guardarThemeEnLocalStorage);
botonModoClaro.addEventListener("click", ()=>{
    document.body.setAttribute("class","modoClaro");
    menuEstilos.setAttribute("class", "menu-estilos");
    logo.setAttribute("src", "/images/gifOF_logo.png");
    document.body.classList.remove("modoOscuro");
});
botonModoClaro.addEventListener("click", guardarThemeEnLocalStorage);
BOTON_ESTILOS.addEventListener("click", FUNCION_MENU_SHOW);
botonPosiblesResultados1.addEventListener("click", ()=>{
    stringUser = botonPosiblesResultados1.innerText;
})
botonPosiblesResultados2.addEventListener("click", ()=>{
    stringUser = botonPosiblesResultados2.innerText;
})
botonPosiblesResultados3.addEventListener("click", ()=>{
    stringUser = botonPosiblesResultados3.innerText;
})
SEARCH.addEventListener("keyup", autocompletar);
SEARCH.addEventListener("keyup", mostrarSugerencias);
BOTON_SEARCH.addEventListener("click", ocultarAutocomplete);
BOTON_SEARCH.addEventListener("click", ocultarTendencias);
BOTON_SEARCH.addEventListener("click", pushBusqueda);
BOTON_SEARCH.addEventListener("click", buscarGif);  
BOTON_SEARCH.addEventListener("click", cambiarTitulo);
BOTON_SEARCH.addEventListener("click", ocultarSugerencias);
////////////BUSCAR CON POSIBLES RESULTADOS BOTON 1///////////
botonPosiblesResultados1.addEventListener("click", ocultarAutocomplete);
botonPosiblesResultados1.addEventListener("click", ocultarTendencias);
botonPosiblesResultados1.addEventListener("click", pushBusqueda);
botonPosiblesResultados1.addEventListener("click", buscarGif);  
botonPosiblesResultados1.addEventListener("click", cambiarTitulo);
botonPosiblesResultados1.addEventListener("click", ocultarSugerencias);
////////////BUSCAR CON POSIBLES RESULTADOS BOTON 2///////////
botonPosiblesResultados2.addEventListener("click", ocultarAutocomplete);
botonPosiblesResultados2.addEventListener("click", ocultarTendencias);
botonPosiblesResultados2.addEventListener("click", pushBusqueda);
botonPosiblesResultados2.addEventListener("click", buscarGif);  
botonPosiblesResultados2.addEventListener("click", cambiarTitulo);
botonPosiblesResultados2.addEventListener("click", ocultarSugerencias);
////////////BUSCAR CON POSIBLES RESULTADOS BOTON 3///////////
botonPosiblesResultados3.addEventListener("click", ocultarAutocomplete);
botonPosiblesResultados3.addEventListener("click", ocultarTendencias);
botonPosiblesResultados3.addEventListener("click", pushBusqueda);
botonPosiblesResultados3.addEventListener("click", buscarGif);  
botonPosiblesResultados3.addEventListener("click", cambiarTitulo);
botonPosiblesResultados3.addEventListener("click", ocultarSugerencias);
botonMisGuifos.addEventListener("click", ()=>{
    cuadroDeBusqueda.style.setProperty("display", "none");
    gridSugerencias.style.setProperty("display", "none");
    tituloSugerencias.style.setProperty("display", "none");
    gridTendencias.style.setProperty("display", "none");
    tituloTendencias.style.setProperty("display", "none");
    gridResultados.style.setProperty("display", "none");
    tituloMisGuifos.style.setProperty("display", "block");
    gridMisGuifos.style.setProperty("display", "block");
    contenedorBusquedaPrevia.style.setProperty("display", "none");

})
botonMisGuifos.addEventListener("click", mostrarMisGuifos);
