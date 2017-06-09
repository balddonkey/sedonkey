
const mapping = require('./mapping.js');

function sehelp(argv) {
    if (argv == null || argv == '-h' || argv == '--help') phelp();
    else if (argv == '-v' || argv == '--version') pversion();
    else if (argv == '-m' || argv == '--mapping') mapping.pMapping();
    else if (argv == '-s' || argv == '--src') mapping.pSrc();
    else if (argv == '-p' || argv == '--print') mapping.pAllRepos();
    else phelp();
}

function phelp() {
        console.log('\nUsage: sedonkey <command> [options]\n');
        console.log('Options:\n');
        console.log('-h, --help             output usage information');
        console.log('-v, --version          output the version number');
        console.log('-m, --mapping          output the mapping settings')
        console.log('-s, --src              output the trace path/floder')
        console.log('-p, --print            output the repositories in the trace paths/floders\n')
        console.log('Commands: \n')
        console.log('set-mapping    <map> <path/floder>        add path mapping')
        console.log('add-src        <path/floder>              add trace path/floder')
        console.log('search         <respository name>         search the respository with trace paths/floders, output the path')
        console.log('open           <respository name>         open the given respository, if not exist, output')
}

function pversion() {
    const fs = require('fs');
    let d = JSON.parse(fs.readFileSync('./package.json'));
    console.log('sedonkey version: ' + d.version);
}

exports.help = sehelp;
