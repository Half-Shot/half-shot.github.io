var $ = function(selector){return document.querySelectorAll(selector);}

/* I use matrix to get my avatar, because I update it there the most */
function insertAvatar(){
  var avatarURL = "https://souppenguin.com:8448/_matrix/media/r0/download/souppenguin.com/wuaaTbfTFcuCXdPJuLTYGJTk";
  var imgs = $("img.hsavatar");
  for(var i in imgs){
    imgs[i].src = avatarURL;
  }
}

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
insertAvatar();
