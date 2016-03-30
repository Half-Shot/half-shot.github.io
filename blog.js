var fa = require('markdown-it-fontawesome');
const markdown = require('markdown-it')().use(fa);

const mustache = require('mustache');
const fs       = require('fs');
const path     = require('path');
const dateFormat = require('dateformat');

const hs_pages     = require('./pages');

/**
   Blog page format:
   @title How to cut a pineapple
   @author Will
   @created 2011-10-10T14:48:00
   @modified 2011-10-10T14:48:00
**/

function parseMDAttributes(mddata,attributes){
	var lines = mddata.split('\n');
	var outputmd = "";
  for(var l = 0;l<lines.length;l++){
		var line = lines[l].trim();
		if(line.startsWith("@")){
				var split = line.indexOf(" ");
				if(split != -1){
					var attr = line.substr(1,split-1);
					var val = line.substr(split+1);
					attributes[attr] = val;
				}
		}
		else {
				outputmd += lines[l] + '\n';
		}
	}
	return outputmd;
}

function buildPost(mddata,attributes,template,pageout){
  var md = markdown.render(mddata);
  const formatString = "ddd dS mmm yyyy, HH:MM ";
  var meta = {
    siteindex:[],
    article:md,
    created:dateFormat(new Date(attributes["created"]),formatString),
    modified:dateFormat(new Date(attributes["modified"]),formatString)
  };
  var html = mustache.render(template,meta);
  var name = attributes["title"].replace(/ /g,"")+".html";
  name = name.replace(/^\.+/,""); //Build hidden anyway
  fs.writeFile(path.join(pageout,name),html,function(err){
    if(err){
      throw err;
    }
  });
}

function buildBlog(indir,blogtemplate,indextemplate,outdir){

	if(!fs.statSync(outdir)){
		fs.mkdir(outdir);
	}
	
	blogtemplate = fs.readFileSync(blogtemplate,'utf-8');
	indextemplate = fs.readFileSync(indextemplate,'utf-8');

	fs.readdir(indir,function(err,files){
    if(!err){
      for(var f in files){
        var file = files[f];
				var attributes = {};
				var mddata = fs.readFileSync(path.join(indir,file),'utf-8');
        mddata = parseMDAttributes(mddata,attributes);
				buildPost(mddata,attributes,blogtemplate,outdir);
      }
    }
    else{
      throw err;
    }
  });
}

module.exports = {
  buildBlog:buildBlog
}
