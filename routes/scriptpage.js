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
      child = exec("java utils.WriteDataToJsonFile " + 'data/tree.json' + " " + treeData , function (error, stdout, stderr) {
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
          common.createNewFileOnServer('automationData.json', newFolderPath);
          //common.createNewFileOnServer('testdata.html', newFolderPath);
          common.createNewFileOnServer('testdata.json', newFolderPath);

          // fs.readFile('templates/testDataTemplate.html', 'utf8', function(err, data) {
          //    if (err) throw err;
          //
          //    fs.writeFile(newFolderPath + '/testdata.html', data , (err) => {
          //        if (err) throw err;
          //        response.sendStatus(200);
          //    });
          // });
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

            if(files[index] !== scriptFolderData.id + '__' + scriptFolderData.name){
              fs.rename('data/scripts/' + files[index], 'data/scripts/' + scriptFolderData.id + '__' + scriptFolderData.name, function(err){
                if (err) throw err;
                console.log('Script folder is renamed successfully!!!');
              });
            }
        });
    });

    app.post('/api/tree/deleteScriptFolder', function(request, response){
        var scriptFolderData = request.body;
        folderNameToBeDeleted = 'data/scripts/' + scriptFolderData.id + '__' + scriptFolderData.name;
        console.log(folderNameToBeDeleted);
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

    app.post('/api/saveScriptData', function(request, response){
        var scriptData = request.body;

        index = -1;
        fs.readdir('data/scripts/', function(err, files){
            if(err) throw err;
            for(var i = 0; i < files.length; i++){
               if(files[i].startsWith(scriptData.id)){
                   index = i;
                   break;
               }
            }

            fs.writeFile('data/scripts/' + files[index] + '/automation.html', scriptData.stepsHtml , (err) => {
                if (err) throw err;

                fs.writeFileSync('data/scripts/' + files[index] + '/automationData.json', scriptData.automationUserEnteredData)

                fs.writeFile('data/scripts/' + files[index] + '/testdata.json', scriptData.testData , (err) => {
                    if (err) throw err;
                    console.log('Script data is saved to files in "' + files[index] + '" folder');
                    response.sendStatus(200);
                });
            });
        });

        setTimeout(function() {
            generateScriptJavaCode(scriptData.id);
        }, 1000);
    });

    app.get('/api/getScriptHtml', function(request, response){
      var scriptId = request.query.id;

      index = -1;
      fs.readdir('data/scripts/', function(err, files){
          if(err) throw err;
          for(var i = 0; i < files.length; i++){
             if(files[i].startsWith(scriptId)){
                 index = i;
                 break;
             }
          }

          var scriptHtml = {};
          fs.readFile('data/scripts/' + files[index] + '/automation.html', 'utf8', function(err, data) {
             if (err) throw err;
             scriptHtml["automationHtml"] = data;
             response.send(scriptHtml);

            //  fs.readFile('data/scripts/' + files[index] + '/testdata.html', 'utf8', function(err, data) {
            //     if (err) throw err;
            //     scriptHtml["testdataHtml"] = data;
            //     response.send(scriptHtml);
            // });
          });
      });
    });

    app.get('/api/getAutomationUserEnteredData', function(request, response){
      var scriptId = request.query.id;

      index = -1;
      fs.readdir('data/scripts/', function(err, files){
          if(err) throw err;
          for(var i = 0; i < files.length; i++){
             if(files[i].startsWith(scriptId)){
                 index = i;
                 break;
             }
          }

          fs.readFile('data/scripts/' + files[index] + '/automationData.json', 'utf8', function(err, data) {
             if (err) throw err;
             response.send(data);
          });
      });
    });

    app.get('/api/getTestDataUserEnteredData', function(request, response){
      var scriptId = request.query.id;

      index = -1;
      fs.readdir('data/scripts/', function(err, files){
          if(err) throw err;
          for(var i = 0; i < files.length; i++){
             if(files[i].startsWith(scriptId)){
                 index = i;
                 break;
             }
          }

         fs.readFile('data/scripts/' + files[index] + '/testdata.json', 'utf8', function(err, data) {
                if (err) throw err;
                response.send(data);
          });
      });
    });

    app.get('/api/getTestDataTemplate', function(request, response){
       fs.readFile('templates/testdataJsonTemplate.json', 'utf8', function(err, data) {
              if (err) throw err;
              response.send(data);
        });
    });

    function generateScriptJavaCode(scriptId){

      index = -1;
      var files = fs.readdirSync('data/scripts');
      for(var i = 0; i < files.length; i++){
         if(files[i].startsWith(scriptId)){
             index = i;
             break;
         }
      }

      var scriptPath = 'data/scripts/' + files[index];
      var apiScriptCodeTemplate = fs.readFileSync('templates/code_templates/API_Script_Java_Code_Template.txt', 'utf8');
      var scriptName = scriptPath.split('__')[1];
      apiScriptCodeTemplate = apiScriptCodeTemplate.replace('SCRIPT_CLASS_NAME', scriptName);

      var automationData = fs.readFileSync(scriptPath + '/automationData.json', 'utf8')
      var parsedAutoData = JSON.parse(automationData);

      var scriptCode = "";
      currentStepCode = "";

      for(var i = 0; i < Object.keys(parsedAutoData).length;i++){
        var url = parsedAutoData['step'+ (i + 1)].url;

        switch(parsedAutoData['step'+ (i + 1)].method){
           case "GET":
               if(url.length > 0){
                 currentStepCode = fs.readFileSync('templates/code_templates/GET_Method_Code_Template.txt', 'utf8');
                 scriptCode+= currentStepCode.replace('ENDPOINT_URL', url);
                 scriptCode+= "\n";
               }
               break;
           case "POST":
               break;
        }
      }

      var apiScriptCode = apiScriptCodeTemplate.replace('SCRIPT_CODE', scriptCode);

      fs.writeFileSync('data/automation_code/' + scriptName + '.java', apiScriptCode);
      console.log('Script code is generated and saved in ' + scriptName + '.java file');
    }
};
