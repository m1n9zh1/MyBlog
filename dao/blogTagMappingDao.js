var dbutil = require('./DButil');

function insertBlogTagMapping(blogId, tagId, ctime, utime, success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var insertSql = "insert into blog_tags_mapping (`blog_id`, `tag_id`, `ctime`, `utime`) value (?, ?, ?, ?);";
    var params = [blogId, tagId, ctime, utime];
    connection.query(insertSql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
}

function queryBlogTagMappingByTagId(tag_id, success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var querySql = 'select * from blog_tags_mapping where tag_id = ?;';
    var params = [tag_id];
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
}

module.exports.insertBlogTagMapping = insertBlogTagMapping;
module.exports.queryBlogTagMappingByTagId = queryBlogTagMappingByTagId;