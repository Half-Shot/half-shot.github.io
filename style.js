const fs   = require('fs');
const sass = require('node-sass');

module.exports = {
  render: function (SASS_FILE,CSS_FILE) {
    return sass.render({
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
  }
};
