const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./config/config');

var users = require('./js/users');
var routes = require('./routes/routes');

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

app.listen(port, config.ipAddress, function(){
  console.log("Server started on http://" + config.ipAddress + ":" + port);
});
