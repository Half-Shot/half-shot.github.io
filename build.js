const markdown = require('markdown-it');
const mustache = require('mustache');
const path = require('path');

//Local functions
const hs_style = require('./style');
const hs_markdown = require('./style');

OUTPUTDIR = "./public/"
SOURCEDIR = "./source/"

console.log("Starting build");

SASS_FILE = path.join(SOURCEDIR,"style","main.scss");
CSS_FILE = path.join(OUTPUTDIR,"style.css");

console.log("Building SASS");
hs_style.render(SASS_FILE,CSS_FILE);
console.log("Finished SASS");



console.log("Finished build");
