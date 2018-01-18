const common = require('./common');
var fs = require('fs');

module.exports = app => {
    app.get('/scriptpage', function(request, response){
       //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER START****************");
       response.render('ScriptPage.ejs');
       //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER END****************");
    });

    app.post('/api/tree', function(request, response, next){      
      fs.writeFile('data/tree.json', JSON.stringify(request.body), function(err){
         if(err) throw err;
      });
    });
};
