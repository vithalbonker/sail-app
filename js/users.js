var fs = require('fs');
var routes = require('../routes/routes');
var homedir = require('os').homedir();
var userFile = require(homedir + '/data/users.json')
var exec = require('child_process').exec;
var child;

const config = require('../config/config');
const common = require('./common');

module.exports = app => {

  app.post('/', function(request, response){
      var username = request.body.username;
      var password = request.body.password;

      if(username == config.admin_username && password == config.admin_password){
            response.redirect('/users');
      }else if (username == config.user_username && password == config.user_password) {
          response.render('ProjectLogin.ejs');
      }else{
        response.write("Incorrect username/password. Please check and try again!!!");
        response.write("<br><br><a href='/'>BACK</a>");
        response.end();
      }
  });

  app.get('/user', function(request, response){
         //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER START****************");
         response.render('AdminLogin.ejs');
         //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER END****************");
      });
      app.get('/project', function(request, response){
             //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER START****************");
             response.render('ProjectLogin.ejs');
             //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER END****************");
          });

      app.post('/project', function(request, response){
            var username = request.body.username;
            var password = request.body.password;
            common.writeConsoleMessage(username);
            common.writeConsoleMessage(password);



            common.writeConsoleMessage("*******************EDIT START****************");

            var jsonObj;
            fs.readFile(homedir + '/data/users.json', 'utf8', function(err, data) {
               if (err) throw err;
               jsonObj = JSON.parse(data);

               common.writeConsoleMessage("Before Editing users:" + JSON.stringify(jsonObj));
               var index = -1;
               for(var i = 0;i < Object.keys(jsonObj).length;i++){
                 if(jsonObj[i].firstName == username){
                   index = i;

                   break;
                 }

               }

               common.writeConsoleMessage("Index is " + index);

              if(index != -1){
                common.writeConsoleMessage("User is " + jsonObj[index].firstName);
                common.writeConsoleMessage("Password is " + jsonObj[index].lastName);
                 if(username == jsonObj[index].firstName && password == jsonObj[index].lastName){
                   response.render('ProjectLab/ScriptPage.ejs');
                 } else {
                   // response.write("Incorrect username/password. Please check and try again!!!");
                   // response.write("<br><br><a href='/'>BACK</a>");
                   // response.end();
                 response.render('invalid.ejs');
                 }

                } else {
                   response.render('invalid.ejs');
                }

                             common.writeConsoleMessage("*******************EDIT END****************");
                          });
           });

  // app.post('/', function(request, response){
  //   var username = request.body.username;
  //   var password = request.body.password;
  //   common.writeConsoleMessage(username);
  //   common.writeConsoleMessage(password);
  //   if(username == config.admin_username && password == config.admin_username){
  //
  //       //  response.redirect('/users');
  //   }else if(username == config.admin_username && password == config.admin_password){
  //       response.render('adminlab.ejs');
  //   }else {
  //     // response.write("Incorrect username/password. Please check and try again!!!");
  //     // response.write("<br><br><a href='/'>BACK</a>");
  //     // response.end();
  //        response.render('invalid.ejs');
  //   }
  // });

  app.get('/users', function(request, response){
      common.writeConsoleMessage("*******************USERS PAGE RENDER START****************");
      fs.readFile(homedir + '/data/users.json', 'utf8', function(err, data) {
         if (err) throw err;
         var jsonObj = JSON.parse(data);
         response.render('CreateUser.ejs', { users: jsonObj });
      });
      common.writeConsoleMessage("*******************USERS PAGE RENDER END****************");
  });

  app.post('/users', function(request, response){
       common.writeConsoleMessage("*******************USER CREATION START****************");
       var firstName = request.body.firstName;
       var lastName = request.body.lastName;
       var email = request.body.email;

       common.writeConsoleMessage(firstName);
       common.writeConsoleMessage(lastName);
       common.writeConsoleMessage(email);

       if(firstName && lastName && email){
         child = exec("java utils.WriteUsersToJson " + firstName + " " + lastName + " " + email, function (error, stdout, stderr) {
             if (error !== null) {
               common.writeConsoleMessage('exec error: ' + error);
             }
         });

         common.writeConsoleMessage(firstName + " " + lastName + " details are saved!!!");
         response.redirect('/users');
       }
       common.writeConsoleMessage("*******************USER CREATION END****************");
  });

  app.get('/delete', function(request, response){
        common.writeConsoleMessage("*******************DELETE START****************");

        var jsonObj;
        fs.readFile(homedir + '/data/users.json', 'utf8', function(err, data) {
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

           fs.writeFile(userFile, JSON.stringify(jsonObj), function(err){
            if(err) throw err;
          });

          response.redirect('/users');
          common.writeConsoleMessage("*******************DELETE END****************");
        });
  });

  app.post('/users/edit', function(request, response){
      common.writeConsoleMessage("*******************EDIT START****************");

      var jsonObj;
      fs.readFile(homedir + '/data/users.json', 'utf8', function(err, data) {
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

         fs.writeFile(homedir + '/data/users.json', JSON.stringify(jsonObj), function(err){
           if(err) throw err;
         });

         response.redirect('/users');
         common.writeConsoleMessage("*******************EDIT END****************");
      });
  });
};
