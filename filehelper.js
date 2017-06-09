
const fs = require('fs'),
    readline = require('readline');

// 大文件支持
// cb: (line, end) => Void
function readlineAsHuge(path, cb = null) {
    var stat = fs.lstatSync(path);
    if (stat.isDirectory()) {
        console.log('path on ' + path + ' is not a file');
        return;
    }
    if (!fs.existsSync(path)) {
        console.log('file on ' + path + ' not exist');
        rturn;
    }

    var rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
    });

    var lines = new Array();
    rl.on('line', function (line) {
        // you won't see the last line here, as 
        // there is no \n any more
        cb(line, false);
    }).on('close', function() {
        cb(null, true);
    });
}

exports.readlineAsHuge = readlineAsHuge;
