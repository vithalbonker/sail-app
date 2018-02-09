var fs = require('fs');
var routes = require('../routes/routes');
var homedir = require('os').homedir();
var userFile = require(homedir + '/data/users.json')
var exec = require('child_process').exec;
var child;

const config = require('../config/config');
const common = require('../js/common');


module.exports = app => {
  app.get('/admin', function(request, response){
         //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER START****************");
         response.render('AdminLogin.ejs');
         //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER END****************");
      });



      app.post('/admin', function(request, response){
        var username = request.body.username;
        var password = request.body.password;
        common.writeConsoleMessage(username);
        common.writeConsoleMessage(password);
        if(username == config.admin_username && password == config.admin_username){

          response.render('adminlab.ejs');
        } else {
          // response.write("Incorrect username/password. Please check and try again!!!");
          // response.write("<br><br><a href='/'>BACK</a>");
          // response.end();
        response.redirect('/users');
        }
      });
    }
