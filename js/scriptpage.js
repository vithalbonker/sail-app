const common = require('./common');
var fs = require('fs');

module.exports = app => {
    app.get('/scriptpage', function(request, response){
       //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER START****************");
       response.render('ScriptPage.ejs');
       //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER END****************");
    });

    app.get('/api/tree', function(request, response){
        fs.readFile('data/tree.json', 'utf8', function(err, data) {
           if (err) throw err;
           var jsonObj = JSON.parse(data);
           response.json(jsonObj);
        });        
    });

    app.post('/api/tree', function(request, response, next){
      //console.log(JSON.stringify(request.body));
      fs.writeFile('data/tree.json', JSON.stringify(request.body), function(err){
         if(err) throw err;
         response.sendStatus(200);
         next();
      });
    });
};
