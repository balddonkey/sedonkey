
const fs = require('fs');
const path = require('path');

const configName = 'sedonkey.config.json';
const argvs = process.argv;
const shellPath = __dirname;
const configPath = path.join(shellPath, '../', configName);

function description() {
    if (fs.existsSync(configPath)) {
        let text = fs.readFileSync(configPath);
        if (text.length == 0) {
            console.log('No path map settings.');
            return;
        }
        let data = parseConfig(text);
        if (data) {
            let configs = data;
            for (var key in configs) {
                if (configs.hasOwnProperty(key)) {
                    var elem = configs[key];
                    if (elem.path) {
                        console.log(key + ': ' + elem.path);
                    }
                }
            }
        } else {
            console.log('No path map settings.');
        }
    } else {
        console.log('No path map settings.');
    }
}

function search(repository, map) {
    console.log('search: ' + repository + (map ? ' in ' + map : ''));
    let configs = resovelConfogsFile();
    if (map) {
        if (configs[map].path) {
            searchAtPath(repository, configs[map]. path);
        } else {
            console.log('Path map: ' + map + ' not found');
        }
    } else {
        for (var key in configs) {
            if (configs.hasOwnProperty(key)) {
                let elem = configs[key];
                let p = elem.path;
                if (path) {
                    searchAtPath(repository, p);
                }
            }
        }
    }
}

function searchAtPath(repository, p) {
    if (!fs.existsSync(p)) {
        return;
    }
    if (fs.lstatSync(p).isFile()) {
        return;
    }
    let base = p.split('/').pop();
    fs.readdir(p, function( err, files) {
        files.forEach(function(file) {
            console.log(path.join(p, file));
            if (file.indexOf(base) >= 0) {
                
            }
        }, this);
    });
}

function remove(map) {
    console.log('remove: ' + map);
    let configs = resovelConfogsFile();
    if (!configs[map]) {
        console.log('path map: ' + map + ' not exist');
    }
    let p = configs[map].path;
    let desc = configs[map].desc;
    delete configs[map];
    let text = JSON.stringify(configs, null, 4);
    console.log(text);
    fs.writeFile(configPath, text, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('remove done' + (p ? ': \n' + map + ': ' + p : '') + (desc ? '\ndesc: ' + desc : ''))
        }
    })
}

// 解决配置文件的各种潜在问题，格式不正确等，将重建
function resovelConfogsFile() {
    if (fs.existsSync(configPath)) {
        let text = fs.readFileSync(configPath);
        let data = parseConfig(text)
        let configs;
        if (!data) {
            resetConfigs();
            configs = JSON.parse(fs.readFileSync(configPath));
        } else {
            configs = data;
        }
        return configs;
    } else {
        resetConfigs();
        let configs = JSON.parse(fs.readFileSync(configPath));
        return configs;
    }
}

function add(p, map, description) {
    console.log('add: ' + p + (map ? ' as ' + map : ''));
    if (description) {
        console.log('desc: ' + description);
    }
    let configs = resovelConfogsFile();
    if (map == null) {
        map = path.basename(p);
    }
    if (configs[map] && configs[map].path) {
        console.log('map exists\n' + map + ': ' + configs[map].path + '\nwill replace with: ' + p);
    }
    let config = {
        path: p
    }
    if (description) {
        config['desc'] = description;
    }
    configs[map] = config;
    fs.writeFile(configPath, JSON.stringify(configs, null, 4), function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('add done');
        }
    })
}

function parseConfig(text, cb) {
    let value;
    try {
        value = JSON.parse(text);
    } catch (e) {
        let err = 'No path map settings.';
        return null;
    }
    if (value instanceof Object
        && !(value instanceof Array)
        && value != null) {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                return value;
            }
        }
        let err = 'Illegal JSON, see README.md';
        return null;
    }
    let err = 'Illegal JSON, see README.md';
    return null;
}

function resetConfigs() {
    let configs = {};
    fs.writeFileSync(configPath, JSON.stringify(configs, null, 4));
}

let funcs = {
    description: description,
    search: search,
    add: add,
    remove: remove
};

module.exports = funcs;
