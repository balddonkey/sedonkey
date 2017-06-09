#!/usr/bin/env node  

const exec = require('child_process').execSync;
const fs = require('fs');
const help = require('./help.js').help;

var args = process.argv.splice(2)

if (args.length > 0) {
    if (args[0].startsWith('-')) help(args[0]);
} else {
    help(null)
}
