const markdown = require('markdown-it')();
const mustache = require('mustache');
const fs       = require('fs');
const path     = require('path');
const dateFormat = require('dateformat');

siteIndex = []

function buildIndex(pagein,extra){
  var files = fs.readdirSync(pagein);
  var index = [];
  for(var f in files){
    var file = files[f];
    console.log("Page found:"+file);
    if(!file.startsWith('.')){
      index.push(file.replace(".md",""));
    }
  }
  if(extra){
    index = index.concat(extra);
  }
  siteIndex = index;
}

function buildPage(file,template,pageout){
  var text = fs.readFileSync(file,'utf-8');
  var md = markdown.render(text);
  var stats = fs.statSync(file);
  const formatString = "ddd dS mmm yyyy, HH:MM ";
  var meta = {
    siteindex:siteIndex,
    article:md,
    created:dateFormat(stats.birthtime,formatString),
    modified:dateFormat(stats.ctime,formatString)
  };
  var html = mustache.render(template,meta);
  var name = path.basename(file,'.md')+".html";

  name = name.replace(/^\.+/,""); //Build hidden anyway
  fs.writeFile(path.join(pageout,name),html,function(err){
    if(err){
      throw err;
    }
  });
}

function buildPages(pagein,template,pageout){
  var mst = fs.readFileSync(template,'utf-8');
  mustache.parse(mst);
  fs.readdir(pagein,function(err,files){
    if(!err){
      for(var f in files){
        var file = files[f];
        buildPage(path.join(pagein,file),mst,pageout);
      }
    }
    else{
      throw err;
    }
  });
}

module.exports = {
  buildPages:buildPages,
  buildPage:buildPage,
  buildIndex:buildIndex
}
