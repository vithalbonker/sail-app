var fs = require('fs');
var routes = require('../routes/routes');
var homedir = require('os').homedir();
var userFile = require(homedir + '/data/users.json')
var exec = require('child_process').exec;
var child;

const config = require('../config/config');
const common = require('../js/common');

module.exports = app => {

      app.get('/newUser', function(request, response){
             //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER START****************");
             response.render('CreateNewUser.ejs');
             //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER END****************");
          });

          app.post('/newUser', function(request, response){
             common.writeConsoleMessage("*******************USER CREATION START****************");
             var username = request.body.username;
             var email = request.body.emailid;
             var passcode = config.user_passcode;
             var category = request.body.options;

             common.writeConsoleMessage(username);
             common.writeConsoleMessage(email);
             common.writeConsoleMessage(passcode);
             common.writeConsoleMessage(category);


             if(username && email && passcode && category){
               child = exec("java utils.WriteUsersToJson " + username + " " + passcode + " " + email, function (error, stdout, stderr) {
                   if (error !== null) {
                     common.writeConsoleMessage('exec error: ' + error);
                   }
               });
             // } else{
             //   response.render('invalid.ejs');
             // }

               common.writeConsoleMessage(username  + " details are saved!!!");
               response.redirect('/userdetails');
             }
             common.writeConsoleMessage("*******************NEW USER CREATION END****************");
          });


        }
