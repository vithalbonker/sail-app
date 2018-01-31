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

    app.post('/api/tree/createScriptFolder', function(request, response){
        var scriptFolderData = request.body;

        var newFolderName = scriptFolderData.id + '__' + scriptFolderData.name;
        newFolderPath = 'data/scripts/' + newFolderName;

        try {
          fs.statSync(newFolderPath);
        } catch(e) {
          fs.mkdirSync(newFolderPath);
          console.log('"' + newFolderPath + '" script folder is created successfully!!!');
          common.createNewFileOnServer('automation.html', newFolderPath);
          common.createNewFileOnServer('manual.json', newFolderPath);
          common.createNewFileOnServer('testdata.json', newFolderPath);

          response.sendStatus(200);
        }
    });

    app.post('/api/tree/renameScriptFolder', function(request, response){
        var scriptFolderData = request.body;

        index = -1;
        fs.readdir('data/scripts/', function(err, files){
            if(err) throw err;
            for(var i = 0; i < files.length; i++){
               if(files[i].startsWith(scriptFolderData.id)){
                   index = i;
                   break;
               }
            }

            fs.rename('data/scripts/' + files[index], 'data/scripts/' + scriptFolderData.id + '__' + scriptFolderData.name, function(err){
              if (err) throw err;
              console.log('Script folder is renamed successfully!!!');
            })
        })
    });

    app.post('/api/tree/deleteScriptFolder', function(request, response){
        var scriptFolderData = request.body;
        folderNameToBeDeleted = 'data/scripts/' + scriptFolderData.id + '__' + scriptFolderData.name;
        deleteFolderRecursive(folderNameToBeDeleted);
        console.log('"' + folderNameToBeDeleted + '" script folder is deleted successfully!!!');
    });

    var deleteFolderRecursive = function(path) {
        if(fs.existsSync(path)) {
          fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
    };

    app.post('/api/saveScriptToHtml', function(request, response){
        var scriptHTMLData = request.body;

        index = -1;
        fs.readdir('data/scripts/', function(err, files){
            if(err) throw err;
            for(var i = 0; i < files.length; i++){
               if(files[i].startsWith(scriptHTMLData.id)){
                   index = i;
                   break;
               }
            }

            fs.writeFile('data/scripts/' + files[index] + '/automation.html', scriptHTMLData.html , (err) => {
                if (err) throw err;                
                console.log('HTML data is saved to automation.html in "' + files[index] + '" folder');
            });

        })
    });
};
