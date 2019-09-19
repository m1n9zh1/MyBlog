var commentDao = require('../dao/commentDao');
var timeUtil = require('../util/timeUtil');
var respUtil = require('../util/respUtil');
var captcha = require('svg-captcha');
var url = require('url');
var path = new Map();

function insertComment(request, response) {
    var params = url.parse(request.url, true).query;
    if (!request.cookies.comment_author || !request.cookies.comment_author_ermail) {
        response.cookie('comment_author', params.username);
        response.cookie('comment_author_email', params.email);
    }

    commentDao.insertComment(parseInt(params.blogId), parseInt(params.parent), params.username, params.email, params.content, timeUtil.getNow(), timeUtil.getNow() , function (result) {
        response.writeHead(200);
        response.write(respUtil.createResult('success', '添加成功', null));
        response.end();
    })
};
path.set('/insertComment', insertComment);

function queryCommentByBlogId(request, response) {
    var params = url.parse(request.url, true).query;
    commentDao.queryCommentByBlogId(parseInt(params.blogId),function (result) {
        var len = result.length;
        for (var i = 0; i < len; i ++) {
            result[i].ctime = timeUtil.dateChinese(result[i].ctime)
        }
        result.reverse();
        response.writeHead(200);
        response.write(respUtil.createResult('success', '查询成功', result));
        response.end();
    })
};
path.set('/queryCommentByBlogId', queryCommentByBlogId);

function queryCommentByTime(request, response) {
    commentDao.queryCommentByTime(function (result) {
        for (var i = 0; i < result.length; i ++) {
            if (result[i].comment.length > 16) {
                result[i].comment = result[i].comment.substring(0, 16) + '···';
            }
        }
        response.writeHead(200);
        response.write(respUtil.createResult('success', '查询成功', result));
        response.end();
    })
};
path.set('/queryCommentByTime', queryCommentByTime);


function queryRandomCode(request, response) {
    var code = captcha.create({fontSize: 50, width: 100, height: 35});
    response.writeHead(200);
    response.write(respUtil.createResult('success', '查询成功', code));
    response.end();
}

path.set('/queryRandomCode', queryRandomCode);
module.exports = path;