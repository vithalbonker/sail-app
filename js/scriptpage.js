const common = require('./common');
var fs = require('fs');

var exec = require('child_process').exec;
var child;

module.exports = app => {
    app.get('/scriptpage', function(request, response){
       //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER START****************");
       response.render('ScriptPage.ejs');
       //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER END****************");
    });

    app.get('/api/tree', function(request, response){
        fs.readFile('data/tree.json', 'utf8', function(err, data) {
           if (err) throw err;
           //var jsonObj = JSON.parse(data);
           console.log(data);
           response.send(JSON.parse(data));
        });
    });

    app.post('/api/tree', function(request, response, next){
      var treeData = JSON.stringify(request.body)

      // fs.writeFile('data/tree.json', treeData, function(err){
      //    if(err) throw err;
      //    response.sendStatus(200);
      //    next();
      // });

      child = exec("java utils.WriteTreeDataToJson " + treeData , function (error, stdout, stderr) {
          if (error !== null) {
            common.writeConsoleMessage('exec error: ' + error);
          }else{
            response.sendStatus(200);
          }
      });
    });
};
