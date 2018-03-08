const common = require('../js/common');
var fs = require('fs');
//var homedir = require('os').homedir();

var data_dir = process.cwd();

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var child;

module.exports = app => {
    app.get('/scriptpage', function(request, response){
       //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER START****************");
       response.render('ScriptPage.ejs');
       //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER END****************");
    });

    app.get('/api/tree', function(request, response){
        fs.readFile(data_dir + '/data/tree.json', 'utf8', function(err, data) {
           if (err) throw err;
           response.send(JSON.parse(data));
        });
    });

    app.post('/api/tree', function(request, response, next){
      var treeData = JSON.stringify(request.body);
      execSync("cd " + data_dir +  "/data && java utils.WriteDataToJsonFile " + data_dir + '/data/tree.json' + " " + treeData);
      deleteJunkScriptFoldersFromServer();
      response.sendStatus(200);
    });

    function deleteJunkScriptFoldersFromServer(){
      var treeData = fs.readFileSync(data_dir + '/data/tree.json', 'utf8');
      var parsedTreeData = JSON.parse(treeData);
      var keys = Object.keys(parsedTreeData);

      var scriptFolders = fs.readdirSync(data_dir + '/data/scripts');
      for(var i = 0; i < scriptFolders.length; i++){
         var scriptId = scriptFolders[i].split('__')[0];
         var scriptName = scriptFolders[i].split('__')[1];
         var found = false;

         for(var j = 0; j < keys.length;j++){
            if(parsedTreeData[keys[j]].id === scriptId && parsedTreeData[keys[j]].text === scriptName){
              console.log('Found: ' + scriptFolders[i]);
               found = true;
               break;
            }
         }

         if(!found){
           console.log('NOT Found: ' + scriptFolders[i]);
           deleteFolderRecursive(data_dir + '/data/scripts/' + scriptFolders[i]);
         }
      }
    }

    app.post('/api/tree/createScriptFolder', function(request, response){
        var scriptFolderData = request.body;

        var newFolderName = scriptFolderData.id + '__' + scriptFolderData.name;
        newFolderPath = data_dir + '/data/scripts/' + newFolderName;

        try {
          fs.statSync(newFolderPath);
        } catch(e) {
          fs.mkdirSync(newFolderPath);
          console.log('"' + newFolderPath + '" script folder is created successfully!!!');
          common.createNewFileOnServer('params.html', newFolderPath);
          common.createNewFileOnServer('paramsData.json', newFolderPath);
          common.createNewFileOnServer('automation.html', newFolderPath);
          common.createNewFileOnServer('automationData.json', newFolderPath);
          //common.createNewFileOnServer('testdata.html', newFolderPath);
          common.createNewFileOnServer('testdata.json', newFolderPath);

          var paramsTemplate = fs.readFileSync(__dirname + '/../templates/paramsTemplate.html', 'utf8')
          fs.writeFileSync(newFolderPath + '/params.html', paramsTemplate);

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
        fs.readdir(data_dir + '/data/scripts/', function(err, files){
            if(err) throw err;
            for(var i = 0; i < files.length; i++){
               if(files[i].startsWith(scriptFolderData.id)){
                   index = i;
                   break;
               }
            }

            if(files[index] !== scriptFolderData.id + '__' + scriptFolderData.name){
              fs.rename(data_dir + '/data/scripts/' + files[index], data_dir + '/data/scripts/' + scriptFolderData.id + '__' + scriptFolderData.name, function(err){
                if (err) throw err;
                console.log('Script folder is renamed successfully!!!');
              });
            }
        });
    });

    app.post('/api/tree/deleteScriptFolder', function(request, response){
        var scriptFolderData = request.body;
        folderNameToBeDeleted = data_dir + '/data/scripts/' + scriptFolderData.id + '__' + scriptFolderData.name;
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
        fs.readdir(data_dir + '/data/scripts/', function(err, files){
            if(err) throw err;
            for(var i = 0; i < files.length; i++){
               if(files[i].startsWith(scriptData.id)){
                   index = i;
                   break;
               }
            }

            fs.writeFileSync(data_dir + '/data/scripts/' + files[index] + '/automation.html', scriptData.automationStepsHtml);
            fs.writeFileSync(data_dir + '/data/scripts/' + files[index] + '/params.html', scriptData.paramsHtml);
            fs.writeFileSync(data_dir + '/data/scripts/' + files[index] + '/paramsData.json', scriptData.paramsUserEnteredData);
            fs.writeFileSync(data_dir + '/data/scripts/' + files[index] + '/automationData.json', scriptData.automationUserEnteredData);
            fs.writeFileSync(data_dir + '/data/scripts/' + files[index] + '/testdata.json', scriptData.testData);

            console.log('Script data is saved to files in "' + files[index] + '" folder');
            response.sendStatus(200);
        });

        setTimeout(function() {
            generateScriptJavaCode(scriptData.id);
        }, 1000);
    });

    app.get('/api/getScriptHtml', function(request, response){
      var scriptId = request.query.id;

      index = -1;
      fs.readdir(data_dir + '/data/scripts/', function(err, files){
          if(err) throw err;
          for(var i = 0; i < files.length; i++){
             if(files[i].startsWith(scriptId)){
                 index = i;
                 break;
             }
          }

          var scriptHtml = {};
          fs.readFile(data_dir + '/data/scripts/' + files[index] + '/automation.html', 'utf8', function(err, data) {
             if (err) {
               console.log('Unable to read the file "' + data_dir + '/data/scripts/' + files[index] + '"');
             }
             else{
               scriptHtml["automationHtml"] = data;

               fs.readFile(data_dir + '/data/scripts/' + files[index] + '/params.html', 'utf8', function(err, data) {
                  if (err) {
                    console.log('Unable to read the file "' + data_dir + '/data/scripts/' + files[index] + '"');
                  }
                  else{
                    scriptHtml["paramsHtml"] = data;
                    response.send(scriptHtml);
                  }
               });
             }

            //  fs.readFile('data/scripts/' + files[index] + '/testdata.html', 'utf8', function(err, data) {
            //     if (err) throw err;
            //     scriptHtml["testdataHtml"] = data;
            //     response.send(scriptHtml);
            // });
          });
      });
    });

    app.get('/api/getParamsUserEnteredData', function(request, response){
      var scriptId = request.query.id;

      index = -1;
      fs.readdir(data_dir + '/data/scripts/', function(err, files){
          if(err) throw err;
          for(var i = 0; i < files.length; i++){
             if(files[i].startsWith(scriptId)){
                 index = i;
                 break;
             }
          }

          fs.readFile(data_dir + '/data/scripts/' + files[index] + '/paramsData.json', 'utf8', function(err, data) {
             if (err) throw err;
             response.send(data);
          });
      });
    });

    app.get('/api/getAutomationUserEnteredData', function(request, response){
      var scriptId = request.query.id;

      index = -1;
      fs.readdir(data_dir + '/data/scripts/', function(err, files){
          if(err) throw err;
          for(var i = 0; i < files.length; i++){
             if(files[i].startsWith(scriptId)){
                 index = i;
                 break;
             }
          }

          fs.readFile(data_dir + '/data/scripts/' + files[index] + '/automationData.json', 'utf8', function(err, data) {
             if (err) throw err;
             response.send(data);
          });
      });
    });

    app.get('/api/getTestDataUserEnteredData', function(request, response){
      var scriptId = request.query.id;

      index = -1;
      fs.readdir(data_dir + '/data/scripts/', function(err, files){
          if(err) throw err;
          for(var i = 0; i < files.length; i++){
             if(files[i].startsWith(scriptId)){
                 index = i;
                 break;
             }
          }

         fs.readFile(data_dir + '/data/scripts/' + files[index] + '/testdata.json', 'utf8', function(err, data) {
                if (err) throw err;
                response.send(data);
          });
      });
    });

    app.get('/api/getTestDataTemplate', function(request, response){

       fs.readFile(__dirname + '/../templates/testdataJsonTemplate.json', 'utf8', function(err, data) {
              if (err) throw err;
              response.send(data);
        });
    });

    function escapeRegExp(string){
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function replaceAll(str, term, replacement) {
        return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
    }

    function generateScriptJavaCode(scriptId){
        index = -1;
        var files = fs.readdirSync(data_dir + '/data/scripts');
        for(var i = 0; i < files.length; i++){
           if(files[i].startsWith(scriptId)){
               index = i;
               break;
           }
        }

        var scriptPath = data_dir + '/data/scripts/' + files[index];
        var apiScriptCodeTemplate = fs.readFileSync(__dirname + '/../templates/code_templates/API_Script_Java_Code_Template.txt', 'utf8');
        var scriptName = scriptPath.split('__')[1];
        apiScriptCodeTemplate = replaceAll(apiScriptCodeTemplate, 'SCRIPT_CLASS_NAME', scriptName);

        var currentStepCode = "";

        var paramsCode = "";
        var paramsData = fs.readFileSync(scriptPath + '/paramsData.json', 'utf8')
        var parsedParamsData = JSON.parse(paramsData);
        currentStepCode = fs.readFileSync(__dirname + '/../templates/code_templates/Param_Java_Code_Template.txt', 'utf8');

        for(var i = 0;i < Object.keys(parsedParamsData).length;i++){
          if(i > 0){
            paramsCode+= '\t\t\t\t';
          }
          switch(JSON.parse(parsedParamsData[i]).type){
              case "Header Param":
                  paramsCode+= currentStepCode.replace('PARAM_TYPE', 'headerParams');
                  break;
              case "Query Param":
                   paramsCode+= currentStepCode.replace('PARAM_TYPE', 'queryParams');
                   break;
              case "Path Param":
                    paramsCode+= currentStepCode.replace('PARAM_TYPE', 'pathParams');
                    break;
          }

          paramsCode = replaceAll(paramsCode, 'PARAM_NAME', JSON.parse(parsedParamsData[i]).name);
          paramsCode+= "\n";
        }

        var apiScriptCode = replaceAll(apiScriptCodeTemplate, 'PARAMS_CODE', paramsCode);

        var scriptCode = "";
        var automationData = fs.readFileSync(scriptPath + '/automationData.json', 'utf8')
        var parsedAutoData = JSON.parse(automationData);

        for(var i = 0; i < Object.keys(parsedAutoData).length;i++){
          if(i > 0){
            scriptCode+= "\t\t\t\t";
          }

          switch(parsedAutoData['step'+ (i + 1)].stepName){
             case "HTTP Method":
                  switch(parsedAutoData['step'+ (i + 1)].methodName){
                      case "GET":
                          scriptCode+= fs.readFileSync(__dirname + '/../templates/code_templates/GET_Method_Response_Java_Code_Template.txt', 'utf8');
                          break;
                      case "POST":
                          break;
                      case "PUT":
                          break;
                      case "DELETE":
                          break;
                  }
                  break;
             case "Verify Status Code":
                  var expected_status_code = parsedAutoData['step'+ (i + 1)].statusCode;
                  currentStepCode = fs.readFileSync(__dirname + '/../templates/code_templates/Verify_Status_Code_Java_Code_Template.txt', 'utf8');
                  scriptCode+= currentStepCode.replace('EXPECTED_STATUS_CODE', expected_status_code);
                  break;
             case "Verify Response Content Type":
                  var expected_content_type = parsedAutoData['step'+ (i + 1)].contentType;
                  currentStepCode = fs.readFileSync(__dirname + '/../templates/code_templates/Verify_Response_Content_Type_Java_Code_Template .txt', 'utf8');
                  scriptCode+= replaceAll(currentStepCode, 'RESPONSE_CONTENT_TYPE', expected_content_type);
                  break;
          }
          scriptCode+= "\n\n";
        }

        apiScriptCode = apiScriptCode.replace('SCRIPT_CODE', scriptCode);
        fs.writeFileSync(data_dir + '/data/automation_code/' + scriptName + '.java', apiScriptCode);
        console.log('Script code is generated and saved in ' + scriptName + '.java file');
    }
};
