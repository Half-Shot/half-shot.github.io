document.querySelector("button#bingo").onclick = function(){
  var b = new Request("/data/matrix_bingo.json");
  fetch(b).then(function(response) {
    return response.json()
  }).then(function(bingo_items) {
    var element = document.querySelector("#bingocard");
    element.innerHTML = "";
    var html = "<table>"
    for(var r = 0;r<5;r++){
      html += '<tr>';
      for(var c = 0;c<5;c++){
        var rando = Math.round(Math.random()*bingo_items.length-1);
        var item = bingo_items.splice(rando,1);
        html+= '<td>' + item + '</td>';
      }
      html+= '</tr>';
    }
    html+= '</table>';
    element.innerHTML = html;
  });
}
