// ==UserScript==
// @name        Diochan PLAS
// @namespace   Violentmonkey Scripts
// @match       https://www.diochan.com/*
// @grant       none
// @version     0.2.0
// @author      Mona~
// @description 16/12/2022, 11:28:39
// ==/UserScript==

// funzione che mi aggiunge il link a sug nelle navbar
function addSug(pos){
  // ottegno un array contenente la boardlist
  var navbar = document.getElementsByClassName("boardlist");
  // creo un elemento span perchè così se lo gestisce diochan
  var sugContainer = document.createElement("span");
  // gli metto la classe che hanno gli altri span nella navbar
  sugContainer.setAttribute("class", "sub");
  // gli metto una descrizione false, assistenza un cazzo
  sugContainer.setAttribute("data-description", "Assistenza");
  // creo il link
  var sugLink = document.createElement("a");
  // gli setto la destinazione
  sugLink.setAttribute("href", "https://www.diochan.com/sug/");
  // e il titolo della board a cui reindirizza
  sugLink.setAttribute("title", "Suggerimenti & Lamentele");
  //inserisco nel link il nome effettivo della board
  sugLink.appendChild(document.createTextNode("sug"));
  // aggiungo lo spazio vuoto altrimenti non rispetto lo "stile" di base
  sugContainer.appendChild(document.createTextNode("\u00A0["));
  // inserisco nel container principale il link  su generato
  sugContainer.appendChild(sugLink);
  // aggiungo un'altro spazio vuoto altrimenti non rispetto lo "stile" di base
  sugContainer.appendChild(document.createTextNode("]\u00A0"));
  // aggiungo alla barra lo span su generato
  navbar[pos].appendChild(sugContainer);
}

// funzione che mi associa la barra degli stili superiore con quella inferiore (e viceversa)
function associate(){
  //trovo le combobox nel dom
  // quella sotto
  var first = document.getElementById('style-select').getElementsByTagName("select")[0];
  // quella sopra
  var second = document.getElementById('style-select-top').getElementsByTagName("select")[0];
  //handler che mi prende il valore di una combobox e lo setta all'altra (e vicevesra)
  var handler = function () {
    // se è questa la combobox giù
    if (this === first) {
      // allora ggiorno il valore a quella su
      second.value = this.value;
    }
    // altrimenti se è la combobox su
    else {
      // allora aggiorno quella giù
      first.value = this.value;
      // e faccio partire l'evento di quella giù (adoro JS!)
      first.dispatchEvent(new Event('change'))
    }

  };
  // aggingo l'handler ai listeners con change, così quando cambiano valore le combobox chiamano l'handler
  first.addEventListener('change', handler, false);
  second.addEventListener('change', handler, false);
}

// funzione che mi clona la combobox contenente gli stili, sopra
function cloneStyleBoxToTop(display){
  // mi copio la combobox
  var elem = document.querySelector('#style-select');
  // e lo clono
  var clone = elem.cloneNode(true);
  clone.style.margin = null;
  clone.style.marginRight = "1em";
  //clone.setAttribute("style", "margin-right: 1em !important;");
  clone.id = 'style-select-top';
  var navbar = document.getElementsByClassName("boardlist")[0];
  navbar.appendChild(clone);
  if(!display){
    elem.style.display = "none";
  }
}

// funzione deprecata che setta l'attributo lastReplyTime ad ogni filo in catalogo (utile per oridnare in base al tempo)
/*
 * function setLastReplyToCatalogCell(){
  // piglio tutti i fili
  var filiCatalogo = document.getElementsByClassName("mix");
  // per ogni filo
  for (let i = 0; i < filiCatalogo.length; i++) {
    // prendo l'url del filo
    var url = filiCatalogo[i].getElementsByTagName("a")[0].href;
    // creo una request
    const req = new XMLHttpRequest();
    // quando la request termina
    req.onloadend = function() {
      //console.log("DONE!");
      // ottengo il dom del filo come stringa
      var thinghy = this.responseText;
      // lo converto in oggetto dom
      var g = new DOMParser().parseFromString(thinghy, "text/html");
      // prendo tutti i timestamp nel filo
      var f = g.getElementsByTagName("time");
      // setto come attributo del filo l'ultimo dei timestamp
      filiCatalogo[i].setAttribute("lastReplyTime", f[f.length-1].innerHTML);
      // console.log(f[f.length-1].innerHTML);
    };
    // apro la request
    req.open("GET", url);
    // la invio
    req.send();
  }
}
*/

// funzione che usa le api del chan, setta l'attributo lastReplyTime ad ogni filo in catalogo (utile per oridnare in base al tempo)
function setLastReplyToCatalogCell(){
  // piglio tutti i fili
  var filiCatalogo = document.getElementsByClassName("mix");
  // per ogni filo
  for (let i = 0; i < filiCatalogo.length; i++) {
    // prendo l'url del filo
    var url = filiCatalogo[i].getElementsByTagName("a")[0].href;
    // sostituisco il .html con .json per usare le api
    url = url.replace("html", "json");
    // creo una request
    const req = new XMLHttpRequest();
    // quando la request termina
    req.onloadend = function() {
      //console.log("DONE!");
      // ottengo il json del filo
      var thinghy = this.response;
      // mi salvo in "unix time" la data e l'ora dell'ultima reply
      var lastPostTime = thinghy.posts[thinghy.posts.length - 1].last_modified;
      // setto come attributo del filo l'ultimo dei timestamp
      filiCatalogo[i].setAttribute("lastReplyTime", lastPostTime);
      // console.log(f[f.length-1].innerHTML);
    };
    // dichiaro che la risposta è un file json
    req.responseType = 'json';
    // apro la request
    req.open("GET", url, true);
    // la invio
    req.send();
  }
}

function ordinaFiliUltimaRisposta(){
  // ottengo la griglia di base
  var griglia = document.getElementById('Grid');
  // ottengo i fili in catalogo
  var filiNonOrdinati = document.getElementsByClassName('mix');
  // creo na lista
  var listaFili = [];
  // per ogni filo
  for (i = 0; i < filiNonOrdinati.length; i++) {
    // mi salvo nell'array l'item che mi serve
    listaFili.push(filiNonOrdinati.item(i));
  }
  // inizio ad ordinare
  listaFili.sort(
    function(a, b) {
      // lo faccio in base all'attributo last reply messo grazie alle api di qualche funzione su
      var compA = a.getAttribute('lastreplytime');
      // idem con patate
      var compB = b.getAttribute('lastreplytime');
      // li ordino in base in modo decrescente
      return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
    }
  );
  // per ogni filo nella lista ordinata
  for (i = 0; i < listaFili.length; i++) {
    // lo rimetto nella griglia con lo spazietto :3
    griglia.appendChild(listaFili[i]).after("\u00A0");
  }
  // rimuovo il link che mi ordina perchè altrimenti se cliccato ripetutamente sminchia il layout, oltretutto bisogna ripetere l'azione ad ogni refresh
  document.getElementById("ordinaperreply").style.display = "none";
}

function displayOrderByLastReplyTasto(){
  // sito fatto davvero col culo... Più elementi hanno lo stesso id, gragolone impiccati dio cane!
  var archivio = document.getElementById("unimportant");
  // creo il link
  var orderLastReply = document.createElement("a");
  // gli do un id decente per gli standard di stosito di merda!
  orderLastReply.setAttribute("id", "ordinaperreply");
  // una bella descrizione
  orderLastReply.setAttribute("title", "Ordina i thread in base all'ultima risposta, ignorando la SALVIA!");
  // metto il testo al link
  orderLastReply.appendChild(document.createTextNode("[Ordina: Ultima Risposta]"));
  // e lo inserisco dopo l'archivio, ma dato che gli id sono na merda lo metterà prima dio cane
  archivio.parentNode.insertBefore(orderLastReply, archivio.nextSibling);
  // metto lo spazietto
  orderLastReply.parentNode.insertBefore(document.createTextNode("\u00A0"), orderLastReply);
  // al click gli attacco il listener che ordina
  orderLastReply.addEventListener("click", ordinaFiliUltimaRisposta);
}

function main(){
  // ripeto l'operazione di inserimento due volte perchè se provo ad assegnare sia alla barra top che bottom va a finire che me lo assegna soltanto ad una. JS merda!
  var navbar = document.getElementsByClassName("boardlist");
  // controllo se mi trovo nel catalogo o nell'indice/filo
  if (navbar.length > 1){
    // se si setto la navbar top e bottom
    addSug(0); //navbar top
    addSug(1); //navbar bottom
    cloneStyleBoxToTop(true); // perchè la barra è sempre visibile in un filo aperto
  }
  else{
    // altrimenti solo la top perchè negli altri casi (esempio catalogo) non è presente la bottom navbar
    addSug(0); //navbar top
    cloneStyleBoxToTop(false); // perchè la barra sotto nel catalogo non viene visualizzata!
    setLastReplyToCatalogCell(); // ottengo la last reply di ogni filo
    displayOrderByLastReplyTasto(); // mostro il tasto per ordinare in base all'ultima reply
  }
  associate();
}

// esegui il main
main();
