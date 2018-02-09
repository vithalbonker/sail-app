var fs = require('fs');
var routes = require('../routes/routes');
var homedir = require('os').homedir();
var userFile = require(homedir + '/data/users.json')
var exec = require('child_process').exec;
var child;

const config = require('../config/config');
const common = require('../js/common');

module.exports = app => {

      app.get('/newproject', function(request, response){
             common.writeConsoleMessage("******************Create Project PAGE RENDER START****************");
             response.render('createproject.ejs');
            common.writeConsoleMessage("*******************Create Project PAGE RENDER END****************");
          });

          app.post('/newproject', function(request, response){
             common.writeConsoleMessage("*******************USER CREATION START****************");
             var projectName = request.body.ProjectName;
             var groupId = request.body.GroupId;


             common.writeConsoleMessage(projectName);
             common.writeConsoleMessage(groupId);


             if(firstName && lastName && email){
               child = exec("mvn archetype:generate -DgroupId=com." + groupId + " -DartifactId=" + projectName + " -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false ", function (error, stdout, stderr) {
                   if (error !== null) {
                     common.writeConsoleMessage('exec error: ' + error);
                   }
               });

               common.writeConsoleMessage(firstName + " " + lastName + " details are saved!!!");
               response.redirect('/users');
             }
             common.writeConsoleMessage("*******************USER CREATION END****************");
          });


        }
