// ==UserScript==
// @name        Diochan PLAS
// @namespace   Violentmonkey Scripts
// @match       https://www.diochan.com/*
// @grant       none
// @version     0.1.0
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
  }
  associate();
}

// esegui il main
main();
