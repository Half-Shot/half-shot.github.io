function setQuote(){
  //Experimental request API
  var rQuotes = new Request("quotes.json");
  fetch(rQuotes).then(function(response) {
      return response.json()
    }).then(function(quotes) {
      qn = Math.floor(Math.random() * quotes.length);
      $("header h1").innerHTML = quotes[qn];
    });
}

setQuote();
