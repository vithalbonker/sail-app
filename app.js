const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const config = require('./config/config');

var users = require('./js/users');
var script = require('./routes/scriptpage');

var admin = require('./routes/admin');

var routes = require('./routes/routes');

var newUser = require('./routes/newUser');
var userdetails = require('./routes/userdetails');
var newproject = require('./routes/newproject');
var projectdetails = require('./routes/projectdetails');

var app = express();
const port = 3000;

app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

app.engine('html',require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '/')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/', routes);

users(app);
admin(app);
newUser(app);
userdetails(app);
newproject(app);
projectdetails(app);
script(app);

app.listen(port, config.ipAddress, function(){
  console.log("Server started on http://" + config.ipAddress + ":" + port);
});
