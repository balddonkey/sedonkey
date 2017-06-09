
const fh = require('./filehelper.js');

function pMapping() {
    console.log('\nMappings:\n');
    fh.readlineAsHuge('./bin/PATH_M', function (line, end) {
        if (!end) {
            if (line.startsWith('//')) return;
            console.log(line);
        } else {
            console.log('');
        }
    });
}

function pSrc() {
    console.log('\nMappings:\n');
    fh.readlineAsHuge('./bin/PATH_M', function (line, end) {
        if (!end) {
            if (line.startsWith('//')) return;
            var regExp = /(\w+):\s*(.+)/;
            var res = regExp.exec(line);
            if (res) {
                console.log(res[2]);
            }
        } else {
            console.log('');
        }
    });
}

function pAllRepos() {
    fh.readlineAsHuge('./bin/PATH_M', function (line, end) {
        if (!end) {
            if (line.startsWith('//')) return;
            var regExp = /(\w+):\s*(.+)/;
            var res = regExp.exec(line);
            if (res) {
                pPath(res[2]);
            }
        } else {
            console.log('');
        }
    });
}

function pRepo(map) {
    console.log('p: ' + map);
    pathForMap(map, function (path) {
        if (path) {
            pPath(path);
        } else {
            console.log(map + 'not register');
        }
    });
}

function pPath(path) {
    console.log('p: ' + path);
}

// cb: (path) => Void
function pathForMap(map, cb) {
    fh.readlineAsHuge('./bin/PATH_M', function (line, end) {
        if (!end) {
            if (line.startsWith('//')) return;
            var regExp = /(\w+):\s*(.+)/;
            var res = regExp.exec(line);
            if (res[1] == map) {
                cb(res[1]);
            }
        }
    });
}

exports.pMapping = pMapping;
exports.pSrc = pSrc;
exports.pAllRepos = pAllRepos;
exports.pRepo = pRepo;
