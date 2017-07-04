#!/usr/bin/env node

const exec = require('child_process').exec;

exec("chmod +X ./bin/index.js && npm link", function(err, stdout, stderr){
    if (err) {
        console.log(err);
        return;
    }
    if (stdout) {
        console.log(stdout);
    } 
    if (stderr) {
        console.log(stderr);
    }
});
