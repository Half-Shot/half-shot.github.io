const markdown = require('markdown-it')();
const mustache = require('mustache');
const fs       = require('fs');
const path     = require('path');

siteIndex = []

function buildIndex(pagein){
  var files = fs.readdirSync(pagein);
  var index = [];
  for(var f in files){
    var file = files[f];
    console.log("Page found:"+file);
    if(!file.startsWith('.')){
      index.push(file.replace(".md",""));
    }
  }
  siteIndex = index;
}

function buildPages(pagein,template,pageout){
  var mst = fs.readFileSync(template,'utf-8');
  mustache.parse(mst);
  fs.readdir(pagein,function(err,files){
    if(!err){
      for(var f in files){
        var file = files[f];
        var text = fs.readFileSync(path.join(pagein,file),'utf-8');
        var md = markdown.render(text);
        var meta = {siteindex:siteIndex,article:md};
        var html = mustache.render(mst,meta);
        var name = path.basename(file,'.md')+".html";
        name = name.replace(/^\.+/,""); //Build hidden anyway
        fs.writeFile(path.join(pageout,name),html,function(err){
          if(err){
            throw err;
          }
        });
      }
    }
    else{
      throw err;
    }
  });
}

module.exports = {
  buildPages:buildPages,
  buildIndex:buildIndex
}
