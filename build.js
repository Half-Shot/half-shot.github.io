const path = require('path');

//Local functions
const hs_style = require('./style');
const hs_pages = require('./pages');
const hs_blog = require('./blog');
const ncp = require('ncp').ncp;

OUTPUTDIR = "./public/"
SOURCEDIR = "./source/"

SASS_FILE = path.join(SOURCEDIR,"style","main.scss");
CSS_FILE = path.join(OUTPUTDIR,"style.css");
hs_style.render(SASS_FILE,CSS_FILE);


TEMP_PAGE = path.join(SOURCEDIR,"templates","page.mustache");
PAGEDIR = path.join(SOURCEDIR,"pages");
PAGE_OUT = OUTPUTDIR;//We put pages directly in the output dir.

hs_pages.buildIndex(PAGEDIR,["blog"]);
hs_pages.buildPages(PAGEDIR,TEMP_PAGE,PAGE_OUT);

BLOGDIR = path.join(SOURCEDIR,"blog");
BLOG_OUT = path.join(OUTPUTDIR,"blog");

hs_blog.buildBlog(BLOGDIR,TEMP_PAGE,TEMP_PAGE,BLOG_OUT)

//Copy the static files
STATIC_FILES = path.join(SOURCEDIR,"rootcontent");
STATIC_FILES_OUT = path.join(OUTPUTDIR);

ncp(STATIC_FILES,STATIC_FILES_OUT, function (err) {
 if (err) {
   throw err;
 }
});

console.log("Finished build");
