var dbutil = require('./DButil');
var tagUtil = require('./tagDao');
var blogTagMappingUtil = require('./blogTagMappingDao');


function insertBlog(title, content, tags, views, ctime, utime, success) {
    var insertSql = "insert into blog (`title`,`content`,`tags`,`views`,`ctime`,`utime`) values (?,?,?,?,?,?);";
    var params = [title, content, tags, views, ctime, utime];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end()
}

function queryBlogList(success) {
    var querySql = "select * from blog order by ctime desc";
    var params = [];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end()
}

function queryBlogCount(success) {
    var querySql = 'select count(1) as count from blog;';
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, function (erorr, result) {
        if (erorr == null) {
            success(result);
        }else {
            console.log(erorr);
        }
    })
}

function queryBlogByTag(tag, success) {
    tagUtil.queryTagsByTag(tag, function (result) {
        blogTagMappingUtil.queryBlogTagMappingByTagId(result[0].id, function (result) {
            var data = [];
            var len = result.length;
            for (var i = 0; i < len; i ++) {
                data.push(result[i].blog_id);
            }
            queryBlogByBlogId(data, function (result) {
                success(result);
            })
        })
    })
}

function queryBlogByBlogId(blog_id, success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var str = '';
    for (var i = 0; i < blog_id.length; i ++) {
        str += '?,';
    }
    str = str.replace(/,$/, '');
    var querySql = 'select * from blog where id in (' + str + ');';
    var params = blog_id;
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
};
function queryBlogByViews(success) {
    var connection = dbutil.createConnection();
    connection.connect()
    var querySql = 'select * from blog order by views desc limit 0, 6;';
    connection.query(querySql, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
}

function updateBlogViews(blogId, success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var updateSql = 'update blog set views = views + 1 where id=?;';
    var params = [blogId];
    connection.query(updateSql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();

}

module.exports = {
    'insertBlog' : insertBlog,
    'queryBlogList' : queryBlogList,
    'queryBlogCount' : queryBlogCount,
    'queryBlogByTag' : queryBlogByTag,
    'queryBlogByBlogId' : queryBlogByBlogId,
    'queryBlogByViews' : queryBlogByViews,
    'updateBlogViews': updateBlogViews,
}