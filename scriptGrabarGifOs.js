///URL ENDPOINTS
const URL_GIFS_BY_USER = "https://api.github.com/users/sosacaro";
const URL_UPLOAD = "https://upload.giphy.com/v1/gifs"
const GIPHY_USER_NAME = "SosaCaro";
const GIPHY_API_KEY = "E83LFC5hFXEDnC6KbSjVge3k89s0q5dl";
const URL_SEARCH_BY_ID = "https://api.giphy.com/v1/gifs/";
const URL_FINAL_POST = URL_UPLOAD + "?api_key=" + GIPHY_API_KEY + "&username=" + GIPHY_USER_NAME;
//OBJETOS DEL DOM
let logo = document.getElementById("logo");
let createBox = document.getElementById("create-box");
let tituloMisGUifos = document.getElementById("title-mis-guifos");
let gridMisGuifos = document.getElementsByClassName("grid-mis-guifos")[0];
let cartel = document.getElementById("cartel-oops");
let tituloCreateBox = document.getElementsByClassName("titulo-cuadro-video")[0];
let txtTitulo = tituloCreateBox.getElementsByTagName("p")[0];
let videoBox = document.getElementById("video-box");
let divSubiendo = document.getElementById("subiendo");
let cartelExito = document.getElementById("cartel-exito");
let divGifExitoso = document.getElementById("gif-exitoso");
const LIVE_VIDEO = document.getElementById("live-video");
const VIEWPORT = document.getElementById("viewport");
//BOTONES
let botonComenzar = document.getElementsByClassName("boton-comenzar")[0];
let btnCapture = document.getElementById("btn-capture")
let btnCaptureClicked = document.getElementById("btn-capture-clicked");
let btnRepetir = document.getElementsByClassName("btn-repetir")[0];
let btnSubir = document.getElementsByClassName("btn-subir") [0];
let btnCancelar = document.getElementsByClassName("btn-cancelar")[0];
let botonListo = document.getElementsByClassName("boton-listo")[0];
//VARIABLES A LLENAR
let misGifs =[];
let gifGrabado = "";
let blob;
let stream;
let recorder; 
//FUNCIONES
function tomarThemeDeLocalStorage(){
    if(localStorage.getItem("modoOscuro") === "true"){
        document.body.classList.add("modoOscuro");
        logo.setAttribute("src", "/images/gifOF_logo_dark.png");
    }else{
        document.body.classList.remove("modoOscuro"); 
    }
}
tomarThemeDeLocalStorage();
function mostrarVideoLive(){
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    })
    .then((response)=>{
    stream = response,    
    LIVE_VIDEO.srcObject = stream
    })
}
async function GrabarGif (){
    recorder = new RecordRTCPromisesHandler(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 838,
        height: 440,
    });
    recorder.startRecording();
    const sleep = m => new Promise(r => setTimeout(r, m));
    await sleep(7000);
    await recorder.stopRecording();
    blob = await recorder.getBlob();
    mostrarVistaPrevia(blob)
}
function mostrarVistaPrevia(blob){
    gifGrabado = document.createElement("img");
    let gif = URL.createObjectURL(blob)
    gifGrabado.src = gif;
    LIVE_VIDEO.style.setProperty("display", "none");
    VIEWPORT.appendChild(gifGrabado)
    txtTitulo.innerText = "Vista Previa";
    btnCaptureClicked.style.setProperty("display", "none")
    let botonRepetir = document.getElementsByClassName("btn-repetir")[0];
    let botonSubir = document.getElementsByClassName("btn-subir") [0];
    botonRepetir.style.setProperty("display", "block");
    botonSubir.style.setProperty("display", "block")
}
function repetirCaptura(){
    txtTitulo.innerText = "Un Chequeo Antes de Empezar";
    btnRepetir.style.setProperty("display", "none");
    btnSubir.style.setProperty("display", "none");
    btnCapture.style.setProperty("display", "block");
    gifGrabado.style.setProperty("display", "none")
    LIVE_VIDEO.style.setProperty("display", "block");
    mostrarVideoLive;
}
async function subirGif(){
    let form = new FormData();
    form.append("file", blob, "miGif.gif");
    const response = await fetch(URL_FINAL_POST,{
        mode: "cors",
        method: "POST",
        body: form,
    })
    const responseParseado = await response.json();
    let gifId = responseParseado.data.id;
    if(localStorage.getItem("misGifs") == null){
        misGifs.push(gifId);
        localStorage.setItem("misGifs", JSON.stringify(misGifs));
    }else{
        misGifs = JSON.parse(localStorage.getItem("misGifs"));
        misGifs.push(gifId);
        localStorage.setItem("misGifs", JSON.stringify(misGifs));
    }
}
function mostrarCuadroSubiendo(){
    VIEWPORT.style.setProperty("display", "none");
    txtTitulo.innerText = "Subiendo Guifo";
    let btnCancelar = document.getElementsByClassName("btn-cancelar")[0];
    btnCancelar.style.setProperty("display", "block");
    divSubiendo.style.setProperty("display", "block");
    btnRepetir.style.setProperty("display", "none");
    btnSubir.style.setProperty("display", "none");
    videoBox.appendChild(divSubiendo);
    videoBox.appendChild(btnCancelar);
}
function mostrarMisGuifos(){
    if(localStorage.getItem("misGifs") == null){
        cartel.style.setProperty("display", "block");
    }else{
        misGifs = JSON.parse(localStorage.getItem("misGifs"));
        misGifs.forEach(hacerFetchMisGuifos);
    }
}
function hacerFetchMisGuifos (element){
    fetch(URL_SEARCH_BY_ID + element +"?api_key=" + GIPHY_API_KEY )
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
    })
    .then((bodyEnJson)=>{
        displayMisGuifos(bodyEnJson.data);
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
mostrarMisGuifos();
function eliminarUltimoPush(){
    misGifs = JSON.parse(localStorage.getItem("misGifs"));
    misGifs.pop();
    localStorage.setItem("misGifs", JSON.stringify(misGifs));
}
function ocultarCartelSubiendo(){
    videoBox.style.setProperty("display", "none");
    createBox.style.setProperty("display", "block");
    gridMisGuifos.style.setProperty("display", "block");
    tituloMisGUifos.style.setProperty("display", "block");
}
function mostrarCartelExito(){
    cartelExito.style.setProperty("display", "block");
    videoBox.style.setProperty("display", "none");
    tituloMisGUifos.style.setProperty("display", "block");
    gridMisGuifos.style.setProperty("display", "block");
    gifGrabado.style.setProperty("width", "365px");
    gifGrabado.style.setProperty("heigth", "191px");
    divGifExitoso.appendChild(gifGrabado);
}
//EVENT LISTENERS
botonComenzar.addEventListener("click", ()=>{
    createBox.style.setProperty("display", "none");
    videoBox.style.setProperty("display", "block");
    tituloMisGUifos.style.setProperty("display", "none");
    gridMisGuifos.style.setProperty("display", "none");
})
botonComenzar.addEventListener("click", mostrarVideoLive);
btnCapture.addEventListener("click", ()=>{
    btnCaptureClicked.style.setProperty("display", "block")
    btnCapture.style.setProperty("display", "none")
  });
btnCapture.addEventListener("click", GrabarGif)
btnCapture.addEventListener("click", ()=>{
    txtTitulo.innerText = "Capturando Tu Guifo"
});
btnRepetir.addEventListener("click", repetirCaptura);
btnSubir.addEventListener("click", mostrarCuadroSubiendo);
btnSubir.addEventListener("click", subirGif);
btnSubir.addEventListener("click", ()=> setTimeout(mostrarCartelExito, 4000));
btnCancelar.addEventListener("click", eliminarUltimoPush);
btnCancelar.addEventListener("click", repetirCaptura);
btnCancelar.addEventListener("click", ocultarCartelSubiendo);
botonListo.addEventListener("click", ()=>{
    cartelExito.style.setProperty("display", "none")
});
botonListo.addEventListener("click", ()=>{
    gridMisGuifos.innerHTML = "";
})
botonListo.addEventListener("click", ()=>{
    misGifs = JSON.parse(localStorage.getItem("misGifs"));
    misGifs.forEach(hacerFetchMisGuifos);
});