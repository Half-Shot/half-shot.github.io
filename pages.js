const markdown = require('markdown-it')().use(require('markdown-it-fontawesome')).use(require('markdown-it-anchor')).use(require('markdown-it-highlightjs'));

const mustache = require('mustache');
const fs       = require('fs');
const path     = require('path');
const dateFormat = require('dateformat');

SHOULD_INCLUDE_HTML = true;

function buildIndex(pagein){
  var files = fs.readdirSync(pagein);
  var index = [];
  for(var f in files){
    var file = files[f];
    console.log("Page found:"+file);
    if(!file.startsWith('.')){
      var link = file.replace(/^\.+/,""); //Build hidden anyway
      link = link.replace(/\.(.*)/, SHOULD_INCLUDE_HTML ? ".html" : "");
      var name = link.replace(".html","");
      name = name.replace(/_/g," ");
      index.push({name:name,link:link});
    }
  }
  return index;

}
//Returns {"file":,"data":}
function buildPage(file,template){
  var text = fs.readFileSync(file,'utf-8');
  var md = markdown.render(text);
  var stats = fs.statSync(file);
  const formatString = "ddd dS mmm yyyy, HH:MM ";
  var meta = {
    article:md,
    created:dateFormat(stats.birthtime,formatString),
    modified:dateFormat(stats.ctime,formatString)
  };
  var html = mustache.render(template,meta);
  var name = path.basename(file,'.md')+".html";

  name = name.replace(/^\.+/,""); //Build hidden anyway
  return {"file":name,"data":html};
}

function buildPages(pagein,template){
  var mst = fs.readFileSync(template,'utf-8');
  mustache.parse(mst);
  var files = fs.readdirSync(pagein);
  var pages = [];
  for(var f in files){
    var file = files[f];
    pages.push(buildPage(path.join(pagein,file),mst));
  }
  return pages;
}

module.exports = {
  buildPages:buildPages,
  buildPage:buildPage,
  buildIndex:buildIndex
}
