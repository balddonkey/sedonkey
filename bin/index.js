#!/usr/bin/env node

const cmd = require('commander');
const handler = require('./handler.js');

function initialize() {
    cmd.version('1.0.0')
        .usage('<command> [options]')
        .option('-d, --ddddd', '输出git代码库追踪目录', handler.description);

    cmd.command('search <repository> [map]')
        .description('在指定目录映射查找git代码库')
        .action(function(repository, map) {
            handler.search(repository, map);
        });   
    cmd.command('add <repository> [map] [description]')
        .description('追踪指定目录映射')
        .action(handler.add);  
    cmd.command('remove <map>')
        .description('移除目录映射')
        .action(handler.remove); 

    cmd.parse(process.argv);
}

initialize();
