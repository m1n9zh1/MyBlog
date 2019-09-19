var dbutil = require('./DButil');



function queryTagsByTag(tag, success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var querySql = 'select * from tags where tag=?;'
    var params = [tag];
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
}

function insertTag(tag, ctime, utime, success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var insertSql = "insert into tags (`tag`, `ctime`, `utime`) values (?,?,?)";
    var params = [tag, ctime, utime];
    connection.query(insertSql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
}

function queryTags(success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var querySql = 'select * from tags';
    connection.query(querySql, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log('查询标签错误');
        }
    })
    connection.end();
}

module.exports.queryTagsByTag = queryTagsByTag;
module.exports.insertTag = insertTag;
module.exports.queryTags = queryTags;