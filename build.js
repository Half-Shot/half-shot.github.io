const markdown = require('markdown-it');
const mustache = require('mustache');
const fs   = require('fs');
const path = require('path');
const sass = require('node-sass');

OUTPUTDIR = "./public/"
SOURCEDIR = "./source/"

console.log("Starting build");

SASS_FILE = path.join(SOURCEDIR,"style","main.scss");
CSS_FILE = path.join(OUTPUTDIR,"style.css");

console.log("Building SASS")

sass.render({
  file: SASS_FILE
}, function(err, result) {
	if(err){
		console.error(err);
	}
	else
	{
		fs.writeFileSync(CSS_FILE,result.css);
	}
});

//Build
console.log("Finished build");
