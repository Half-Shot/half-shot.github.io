const mustache = require('mustache');
const fs       = require('fs');

var Template = null;
var MustacheVars = {};

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
  MustacheVars["siteindex"] = MustacheVars["siteindex"].concat(pages);
}

function render(html,extratags){
  var vars = Object.assign(MustacheVars, extratags);
  vars["article"] = html;
  return mustache.render(Template,vars);
}

module.exports = {
    setTemplate:setTemplate,
    addPages:addPages,
    setVar:setVar,
    render:render
}
