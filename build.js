const markdown = require('markdown-it');
const mustache = require('mustache');
const fs   = require('fs');
const path = require('path');
const sass = require('node-sass');

OUTPUTDIR = "./public/"
SOURCEDIR = "./source/"

console.log("Starting build");

SASS_FILE = path.join(SOURCEDIR,"style","main.scss");

//Build
console.log("Finished build");
