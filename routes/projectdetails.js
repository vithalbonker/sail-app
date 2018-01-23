var fs = require('fs');
var routes = require('../routes/routes');
var userFile = require('../data/users.json')
var exec = require('child_process').exec;
var child;

const config = require('../config/config');
const common = require('../js/common');

module.exports = app => {

  app.get('/projectdetails', function(request, response){
    common.writeConsoleMessage("*******************USERS Details PAGE RENDER START****************");
    fs.readFile('data/Projects.json', 'utf8', function(err, data) {
       if (err) throw err;
       var jsonObj = JSON.parse(data);
       response.render('projectdetails.ejs', { users: jsonObj });
    });
    common.writeConsoleMessage("*******************USERS Details PAGE RENDER END****************");
  });

  app.post('/projectdetails', function(request, response){
     common.writeConsoleMessage("*******************Project CREATION START****************");
     var projectName = request.body.projectname;
     // var groupId = request.body.groupid;
      var tool = config.project_tool;
     common.writeConsoleMessage("******Project Details:: "+projectName);
     // common.writeConsoleMessage(groupId);

     if(projectName){
       child = exec("java utils.CreatemvnProject " + projectName, function (error, stdout, stderr) {
           if (error !== null) {
             common.writeConsoleMessage('exec error: ' + error);
           }
           common.writeConsoleMessage(stdout);
       });
       
       child = exec("java utils.WriteProjectToJson " + projectName + " " + projectName + " " + tool, function (error, stdout, stderr) {
           if (error !== null) {
             common.writeConsoleMessage('exec error: ' + error);
           }
       });
       common.writeConsoleMessage(projectName + ":details are saved!!!");
       response.redirect('/projectdetails');
     }
     common.writeConsoleMessage("*******************USER CREATION END****************");
  });

  app.get('/projectdetails/delete', function(request, response){
      common.writeConsoleMessage("*******************User DELETE START****************");

      var jsonObj;
      fs.readFile('data/projects.json', 'utf8', function(err, data) {
         if (err) throw err;
         jsonObj = JSON.parse(data);

         common.writeConsoleMessage("Before deleting users:" + JSON.stringify(jsonObj));
         var index = -1;
         for(var i = 0;i < Object.keys(jsonObj).length;i++){
           if(jsonObj[i].id == request.query.id){
             index = i;
             break;
           }
         }

         if(index === -1) {
           response.statusCode = 404;
           return response.send('Error 404: No user found');
         }

         var deletedUserRecord = jsonObj.splice(index, 1);
         common.writeConsoleMessage("Deleted User Record:" + JSON.stringify(deletedUserRecord));
         common.writeConsoleMessage("After deleting users remaining:" + JSON.stringify(jsonObj));

         fs.writeFile('data/projects.json', JSON.stringify(jsonObj), function(err){
          if(err) throw err;
        });

        response.redirect('/projectdetails');
        common.writeConsoleMessage("*******************user detailsDELETE END****************");
      });
  });

  app.post('/projectdetails/edit', function(request, response){
      common.writeConsoleMessage("*******************EDIT START****************");

      var jsonObj;
      fs.readFile('data/projects.json', 'utf8', function(err, data) {
         if (err) throw err;
         jsonObj = JSON.parse(data);

         common.writeConsoleMessage("Before Editing users:" + JSON.stringify(jsonObj));
         var index = -1;
         for(var i = 0;i < Object.keys(jsonObj).length;i++){
           if(jsonObj[i].id == request.body.id){
             index = i;
             break;
           }
         }

         common.writeConsoleMessage("Index is " + index);

         jsonObj[index].firstName = request.body.update_firstName;
         jsonObj[index].lastName = request.body.update_lastName;
         jsonObj[index].email = request.body.update_email;

         common.writeConsoleMessage("After editing users:" + JSON.stringify(jsonObj));

         fs.writeFile('data/projects.json', JSON.stringify(jsonObj), function(err){
           if(err) throw err;
         });

         response.redirect('/projectdetails');
         common.writeConsoleMessage("*******************user details EDIT END****************");
      });
  });


  app.post('/projectdetails/create', function(request, response){
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


};
