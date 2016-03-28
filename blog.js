const markdown = require('markdown-it')();
const mustache = require('mustache');
const fs       = require('fs');
const path     = require('path');

const hs_pages     = require('./pages');

function buildBlog(indir,blogtemplate,indextemplate,outdir){
  
}

module.exports = {
  buildBlog:buildBlog
}
