
const fs = require('fs');
const path = require('path');

const shellPath = __dirname;
const configName = 'sedonkey.config.json';
const configPath = path.join(shellPath, '../', configName);

const ignoreName = 'ignore.config.json';
const ignorePath = path.join(shellPath, '../', ignoreName);

Array.prototype.contains = function (str) {
    for (var i = 0; i < this.length; i++) {
        var value = this[i];
        if (value == str) {
            return true;
        }
    }
    return false;
}

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

function getIgnoreSetting(configs, config) {
    let ignore = config.ignore || configs.ignore
        || JSON.parse(fs.readFileSync(ignorePath));
    if (!(ignore instanceof Array)) {
        ignore = [];
    }
    return ignore;
}

function search(repository, map) {
    console.log('search: ' + repository + (map ? ' in ' + map : '') + '\n');
    let configs = resovelConfogsFile();
    if (map) {
        if (configs[map] && configs[map].path) {
            let ignore = getIgnoreSetting(configs, configs[map]);
            let results = searchAtPath(repository, configs[map].path, ignore);
            (results && results.length > 0) ?
                results.forEach(function (value) {
                    console.log(value);
                }, this) : console.log('No repository found');
        } else {
            console.log('Path map <' + map + '> not found');
        }
    } else {
        for (let key in configs) {
            if (configs.hasOwnProperty(key)) {
                let elem = configs[key];
                let p = elem.path;
                if (p) {
                    console.log(key + ':');
                    let ignore = getIgnoreSetting(configs, elem);
                    let results = searchAtPath(repository, p, ignore);
                    (results && results.length > 0) ?
                        results.forEach(function (value) {
                            console.log(value + '\n');
                        }, this) : console.log('No repository found\n');
                }
            }
        }
    }
}

function searchAtPath(repository, p, ignore) {
    if (!fs.existsSync(p)) {
        return null;
    }
    if (fs.lstatSync(p).isFile()) {
        return null;
    }
    let base = p.split('/').pop();
    let files = fs.readdirSync(p);
    let results = [];
    files.forEach(function (file) {
        let subpath = path.join(p, file);
        if (ignore.contains(file)) {
            return;
        }
        // console.log(subpath);
        if (fs.lstatSync(subpath).isDirectory()) {
            if (file.toLowerCase().indexOf(repository.toLowerCase()) >= 0
                && fs.existsSync(path.join(subpath, '.git'))) {
                results.push(subpath);
            } else {
                let rs = searchAtPath(repository, subpath, ignore);
                rs.forEach(function (element) {
                    results.push(element);
                }, this);
            }
        }
    }, this);
    return results;
}

function remove(map) {
    console.log('remove: ' + map);
    let configs = resovelConfogsFile();
    if (!configs[map]) {
        console.log('path map: ' + map + ' not exist');
        return;
    }
    let p = configs[map].path;
    let desc = configs[map].desc;
    delete configs[map];
    let text = JSON.stringify(configs, null, 4);
    fs.writeFile(configPath, text, function (err, data) {
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
