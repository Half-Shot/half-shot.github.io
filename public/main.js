var $ = function(selector){return document.querySelectorAll(selector);}

function setQuote(){
  //Experimental request API
  var rQuotes = new Request("quotes.json");
  fetch(rQuotes).then(function(response) {
      return response.json()
    }).then(function(quotes) {
      qn = Math.floor(Math.random() * quotes.length);
      $("header .subtitle")[0].innerHTML = quotes[qn];
    });
}

setQuote();
