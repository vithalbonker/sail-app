var fs = require('fs');

exports.writeConsoleMessage =  function(message){
     console.log(message);
};

exports.createNewFileOnServer = function(fileName, folderPath){
    fs.open(folderPath + '/' + fileName, 'w+', function (err, file) {
        if (err) throw err;
        console.log('"' + fileName + '" is created in the "' + folderPath + '" path');
    });
}
