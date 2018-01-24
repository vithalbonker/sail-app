const common = require('../js/common');
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
           response.send(JSON.parse(data));
        });
    });

    app.post('/api/tree', function(request, response, next){
      var treeData = JSON.stringify(request.body)
      child = exec("java utils.WriteTreeDataToJson " + treeData , function (error, stdout, stderr) {
          if (error !== null) {
            common.writeConsoleMessage('exec error: ' + error);
          }else{
            response.sendStatus(200);
          }
      });
    });

    app.post('/api/createScriptFolder', function(request, response){      
      var newScriptData = request.body;
      console.log(newScriptData);

      var newFolderName = newScriptData.id + '__' + newScriptData.name;
      console.log(newFolderName);

      try {
        fs.statSync('data/scripts/' + newFolderName);
      } catch(e) {
        fs.mkdirSync('data/scripts/' + newFolderName);
        response.sendStatus(200);
      }

    });
};
