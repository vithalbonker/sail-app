const common = require('./common');

module.exports = app => {
    app.get('/scriptpage', function(request, response){
       //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER START****************");
       response.render('ScriptPage.ejs');
       //common.writeConsoleMessage("*******************SCRIPT PAGE RENDER END****************");
    });
};
