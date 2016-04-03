const mustache = require('mustache');
const fs       = require('fs');
const tidy = require('htmltidy2').tidy;

var Template = null;
var MustacheVars = {};

var TIDY_OPTS = {
    hideComments: true, //  multi word options can use a hyphen or "camel case"
    indent: true,
    dropEmptyElements: false
}

//Site Index
MustacheVars["siteindex"] = [];

function setTemplate(templateFile){
  Template = fs.readFileSync(templateFile,'utf-8');
  mustache.parse(Template);
}

function setVar(name,value){
  MustacheVars[name] = value;
}

//{
//'link':
//'name':
//}
function addPages(pages){
  MustacheVars["siteindex"] = pages.concat(MustacheVars["siteindex"]);
}

function render(html,callback,extratags){
  var vars = Object.assign(MustacheVars, extratags);
  for(var i in vars["siteindex"]){
    vars["siteindex"][i]["link"] = vars["siteindex"][i]["link"].replace(/\.(.*)/, "");
  }
  vars["content"] = html;
  //callback(null,mustache.render(Template,vars));
  tidy(mustache.render(Template,vars),TIDY_OPTS,callback);
}

module.exports = {
    setTemplate:setTemplate,
    addPages:addPages,
    setVar:setVar,
    render:render
}
