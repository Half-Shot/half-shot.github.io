var streamURL = "https://half-shot.uk/stream.json";
var player = document.querySelector("audio#stream_player");
var streamended = true;
var player_interval;

function getStream(){
  var rstatus = new Request(streamURL);
  fetch(rstatus).then(function(response) {
    return response.json()
  }).then(function(streamdata) {
    var source = streamdata.icestats.source;
    if(source["audio_bitrate"] != undefined){
       document.querySelector("#stream_offline").hidden = "true";
       document.querySelector("#stream_online").hidden = null;
       document.querySelector("#stream_listeners").innerHTML = source.listeners;
       if(player.paused && streamended){
         player.src = source.listenurl + "?nocache=" + (Math.random()*100); //Dumb hack
         player.play();
       }
       streamended = false;
    }
    else
    {
       document.querySelector("#stream_offline").hidden = null;
       document.querySelector("#stream_online").hidden = "true";
       streamended = true;
    }
  });
}

//player.addEventListener("ended", function() { player_interval = setInterval(getStream,5000); }, true);
player_interval = setInterval(getStream,5000);
getStream();
