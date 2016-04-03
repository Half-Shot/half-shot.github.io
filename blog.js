var fa = require('markdown-it-fontawesome');
const markdown = require('markdown-it')().use(fa);

const mustache = require('mustache');
const fs       = require('fs');
const path     = require('path');
const walk 		 = require('walk');

const dateFormat = require('dateformat');
const hs_pages     = require('./pages');

const SHOULD_INCLUDE_HTML = false;

/**
   Blog page format:
   @title How to cut a pineapple
   @author Will
   @created 2011-10-10T14:48:00
   @modified 2011-10-10T14:48:00
	 @tags banana pineapple fruitcake
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
  // var md = markdown.render(mddata);
  // const formatString = "ddd dS mmm yyyy, HH:MM ";
  // var meta = {
  //   siteindex:[],
  //   article:md,
  //   created:dateFormat(new Date(attributes["created"]),formatString),
  //   modified:dateFormat(new Date(attributes["modified"]),formatString)
  // };
  // var html = mustache.render(template,meta);
  // var name = attributes["title"].replace(/ /g,"")+".html";
  // name = name.replace(/^\.+/,""); //Build hidden anyway
  // fs.writeFile(path.join(pageout,name),html,function(err){
  //   if(err){
  //     throw err;
  //   }
  // });
	return {name:null,html:"",attribs:{}};
}

function buildBlog(indir,blogtemplate,indextemplate)
{
	blogtemplate = fs.readFileSync(blogtemplate,'utf-8');
	mustache.parse(blogtemplate);
	indextemplate = fs.readFileSync(indextemplate,'utf-8');
  var files = [];
	var blogFile = (root, fileStats, next) => {
		if(!fileStats.name.endsWith(".md")){
			next();
			return;
		}

		var attributes = {};
		var realpath = path.join(root,fileStats.name);
		var data = fs.readFileSync(realpath,'utf-8');
		data = parseMDAttributes(data,attributes);
		var date = new Date(attributes["created"]);
		var categoryString = root.replace(indir,"");
		var name = fileStats.name;
		name = name.replace(/\.(.*)/, SHOULD_INCLUDE_HTML ? ".html" : "");
		var fpath = path.join(date.getFullYear().toString(),dateFormat(date,"mm"),categoryString,name);

		const formatStringC = "ddd dS mmm yyyy";
		const formatStringM = "ddd dS mmm yyyy, HH:MM ";
		attributes["dcreated"] = new Date(attributes["created"]);
		attributes["dmodified"] = new Date(attributes["modified"]);
		attributes["created"] = dateFormat(attributes["dcreated"],formatStringC);
		attributes["modified"] = dateFormat(attributes["dmodified"],formatStringM);
		attributes["article"] = markdown.render(data);
		attributes["articlemd"] = data;
		attributes["path"] = fpath;
		attributes["categories"] = categoryString.replace(/\//," ");

	  files.push(
			{
				file:fpath,
				attributes:attributes,
				data:mustache.render(blogtemplate,attributes)
			});
		next();
	}
	walk.walkSync(indir,{listeners:{file:blogFile}});

	files.sort((a,b) => {
		return a.attributes.dcreated < b.attributes.dcreated;
	});

	var subset = files.slice(0,9);//Get the last 10 items;
	for (var f in subset){
		subset[f] = subset[f].attributes;
		subset[f].articlemd = subset[f].articlemd.substr(0,5) + (subset[f].articlemd.length > 5 ? "..." : "");
		subset[f].article = markdown.render(subset[f].articlemd);
	}

	files.push({"file":"index.html","data":mustache.render(indextemplate,{posts:subset})});

	//Make the blog index.
	return files;
}

module.exports = {
  buildBlog:buildBlog
}
