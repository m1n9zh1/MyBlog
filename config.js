const fs = require('fs');
const file = fs.readFileSync('./server.conf').toString().split('\r\n');
let globalConfig = {};
let len = file.length
for (let i = 0; i < len; i++) {
    let temp = file[i].split('=');
    globalConfig[temp[0].trim()] = temp[1];
}
module.exports = globalConfig;