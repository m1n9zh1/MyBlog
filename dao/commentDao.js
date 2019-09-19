var dbutil = require('./DButil');


function insertComment(blogId, parent, username, email, content, ctime, utime, success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var insertSql = 'insert into comments (`blog_id`, `parent`, `user_name`, `email`, `comment`, `ctime`, `utime`) values ( ?, ?, ?, ?, ?, ?, ?);';
    var params = [blogId, parent, username, email, content, ctime, utime];
    connection.query(insertSql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    });
    connection.end();
}

function queryCommentByBlogId(blogId, success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var querytSql = 'select * from comments where blog_id = ?';
    var params = [blogId];
    connection.query(querytSql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    });
    connection.end();
}

function queryCommentByTime( success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var querytSql = 'select * from comments order by ctime desc limit 0,6;';
    connection.query(querytSql, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    });
    connection.end();
}

module.exports = {
    'insertComment' : insertComment,
    'queryCommentByBlogId' : queryCommentByBlogId,
    'queryCommentByTime' : queryCommentByTime,
}