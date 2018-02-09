var fs = require('fs');
var routes = require('../routes/routes');
var homedir = require('os').homedir();
var userFile = require(homedir + '/data/users.json')
var exec = require('child_process').exec;
var child;

const config = require('../config/config');
const common = require('../js/common');

module.exports = app => {

  app.get('/userdetails', function(request, response){
    common.writeConsoleMessage("*******************USERS Details PAGE RENDER START****************");
    fs.readFile(homedir + '/data/users.json', 'utf8', function(err, data) {
       if (err) throw err;
       var jsonObj = JSON.parse(data);
       response.render('UserDetails.ejs', { users: jsonObj });
    });
    common.writeConsoleMessage("*******************USERS Details PAGE RENDER END****************");
  });

  app.post('/userdetails', function(request, response){
     common.writeConsoleMessage("*******************USER CREATION START****************");
     var firstName = request.body.firstName;
     var lastName = config.user_passcode;
     var email = request.body.email;

     common.writeConsoleMessage(firstName);
     common.writeConsoleMessage(lastName);
     common.writeConsoleMessage(email);

     if(firstName && email){
       child = exec("java utils.WriteUsersToJson " + firstName + " " + lastName + " " + email, function (error, stdout, stderr) {
           if (error !== null) {
             common.writeConsoleMessage('exec error: ' + error);
           }
       });

       common.writeConsoleMessage(firstName + " " + lastName + " details are saved!!!");
       response.redirect('/userdetails');
     }
     common.writeConsoleMessage("*******************USER CREATION END****************");
  });

  app.get('/userdetails/delete', function(request, response){
      common.writeConsoleMessage("*******************User DELETE START****************");

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

         fs.writeFile('data/users.json', JSON.stringify(jsonObj), function(err){
          if(err) throw err;
        });

        response.redirect('/userdetails');
        common.writeConsoleMessage("*******************user detailsDELETE END****************");
      });
  });

  app.post('/userdetails/edit', function(request, response){
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

         response.redirect('/userdetails');
         common.writeConsoleMessage("*******************user details EDIT END****************");
      });
  });


  app.post('/userdetails/create', function(request, response){
     common.writeConsoleMessage("*******************USER CREATION START****************");
     var username = request.body.username;
     var password = request.body.password;
     var confirmpassword = request.body.confirmpassword;


     common.writeConsoleMessage(username);
     common.writeConsoleMessage(password);
     common.writeConsoleMessage(confirmpassword);

    if(password == confirmpassword){
     if(username && password && confirmpassword){
       child = exec("java utils.WriteUsersToJson " + username + " " + password + " " + confirmpassword, function (error, stdout, stderr) {
           if (error !== null) {
             common.writeConsoleMessage('exec error: ' + error);
           }
       });
     } else{
       response.render('invalid.ejs');
     }

       common.writeConsoleMessage(username  + " details are saved!!!");
       response.redirect('/userdetails');
     }
     common.writeConsoleMessage("*******************NEW USER CREATION END****************");
  });
};
