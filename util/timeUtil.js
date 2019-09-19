function dateFormat(time) {
    var date = new Date(time * 1000).toLocaleString().replace(/\//g, '-').split(' ')[0];
    return date;
}

function dateChinese(time) {
    var date = new Date(time * 1000).toLocaleString().replace(/[\/,-]/, '年').replace(/[\/,-]/, '月').replace(/ /, '日 ').split(' ')[0];
    return date;
}

function getNow() {
    return Date.now() / 1000;
}
module.exports.dateFormat = dateFormat;
module.exports.getNow = getNow;
module.exports.dateChinese = dateChinese;