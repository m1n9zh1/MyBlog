var fs = require('fs');
var globalConfig = require('./config');
var path = new Map();
var files = fs.readdirSync('./' + globalConfig.web_path);
for (var i = 0; i < files.length; i++) {
    var temp = require('./' + globalConfig.web_path + '/' + files[i])
    if (temp.get) {
        for (var [key, value] of temp) {
            if (path.get(key) == null) {
                path.set(key, value);
            }else {
                throw new Error('url path 配置异常: url(' + key + ')')
            }
        }
    }

}
module.exports = path;