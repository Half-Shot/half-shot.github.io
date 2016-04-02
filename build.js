const path = require('path');
const fs = require('fs');

//Local functions
const hs_style = require('./style');
const hs_pages = require('./pages');
const hs_blog = require('./blog');
const hs_wrap = require('./wrap');

const ncp = require('ncp').ncp;
const rmdir = require('rimraf');

OUTPUTDIR = "./public/"
SOURCEDIR = "./source/"
FONTA_FILES = path.join("node_modules","font-awesome");

SASS_FILE = path.join(SOURCEDIR,"style","main.scss");
CSS_FILE = path.join(OUTPUTDIR,"style.css");

TEMP_SITE = path.join(SOURCEDIR,"templates","site.mustache");
TEMP_PAGE = path.join(SOURCEDIR,"templates","page.mustache");
PAGEDIR = path.join(SOURCEDIR,"pages");

PAGE_OUT = OUTPUTDIR;//We put pages directly in the output dir.

BLOGDIR = path.join(SOURCEDIR,"blog");
BLOG_OUT = path.join(OUTPUTDIR,"blog");

STATIC_FILES = path.join(SOURCEDIR,"rootcontent");
STATIC_FILES_OUT = path.join(OUTPUTDIR);

console.log("Clearing output directory");
rmdir.sync(path.join(OUTPUTDIR,'*'));
console.log("Done");

//Copy the static files
ncp(STATIC_FILES,STATIC_FILES_OUT, function (err) {
if (err) {
   throw err;
}
});

//Copy font awesome
ncp(path.join(FONTA_FILES,"fonts"),path.join(STATIC_FILES_OUT,"fonts"));

//Set up wrapper
hs_wrap.setTemplate(TEMP_SITE);

ncp(path.join(FONTA_FILES,"scss"),path.join(SOURCEDIR,"style","font-awesome")); //Copy font scss
hs_style.render(SASS_FILE,CSS_FILE);

// Pages
hs_wrap.addPages(hs_pages.buildIndex(PAGEDIR));
hs_pages.buildPages(PAGEDIR,TEMP_PAGE).forEach(function(item){
  var p = path.join(PAGE_OUT,item["file"]);
  var data = hs_wrap.render(item["data"]);
  fs.writeFile(p,data,(err) => {
    if (err) throw err;
  })
});


//
// hs_blog.buildBlog(BLOGDIR,TEMP_PAGE,TEMP_PAGE,BLOG_OUT)
//

console.log("Finished build");
