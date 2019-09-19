var editBlogDao = require('../dao/editBlogDao');
var tagDao = require('../dao/tagDao');
var blogTagMapping = require('../dao/blogTagMappingDao');
var siteMap = require('../dao/siteMapDao');
var timeUtil = require('../util/timeUtil');
var respUtil = require('../util/respUtil');
var url = require('url');
var path = new Map();

function editBlog(req, res) {
    var params = url.parse(req.url, true).query;
    var tags = params.tags.replace(/ /g, '').replace(/，/g, ',');
    req.on('data', function (data) {
        editBlogDao.insertBlog(params.title, data.toString(), tags, 0, timeUtil.getNow(), timeUtil.getNow(), function (result) {
            res.writeHead(200);
            res.write(respUtil.createResult('success', '添加成功', null));
            res.end();
            var blogId = result.insertId;
            var tagList = tags.split(',');
            for (var i = 0; i < tagList.length; i++) {
                if (tagList[i] == '') {
                    continue;
                }
                queryTags(tagList[i], blogId);
            }

        })
    })
};
function queryTags(tag, blogId) {
    tagDao.queryTagsByTag(tag, function (result) {
        if (result.length == 0 || result == null) {
            insertTag(tag, blogId);
        }else {
            insertBlogTagMapping(blogId, result[0].id, timeUtil.getNow(), timeUtil.getNow())
        }

    })
}

function insertTag(tag, blogId) {
    tagDao.insertTag(tag, timeUtil.getNow(), timeUtil.getNow(), function (result) {
        insertBlogTagMapping(blogId, result.insertId, timeUtil.getNow(), timeUtil.getNow())
    })
}
function insertBlogTagMapping(blogId, tagId, ctime, utime) {
    blogTagMapping.insertBlogTagMapping(blogId, tagId, ctime, utime,function (result) {
    })
}

path.set('/editBlog', editBlog);

function queryBlogList(req, res) {
    editBlogDao.queryBlogList(function (result) {
        var len = result.length;
        for (var i = 0; i < len; i ++) {
            result[i].ctime = timeUtil.dateFormat(result[i].ctime);
            result[i].tags = result[i].tags.split(',');
            result[i].content = result[i].content.replace(/<img[\W\w]*">/g, '');
            result[i].content = result[i].content.replace(/<[\W\w]{1,5}>/g, '');
            result[i].content = result[i].content.replace(/&nbsp;/g, '');
            result[i].content = result[i].content.substring(0, 300) + '...'
        };
        res.writeHead(200);
        res.write(respUtil.createResult('success', '添加成功', result));
        res.end();
    })

};
path.set('/queryBlogList', queryBlogList);

function queryBlogCount(req, res) {
    editBlogDao.queryBlogCount(function (result) {
        res.writeHead(200);
        res.write(respUtil.createResult('success', '添加成功', result));
        res.end();
    })

}
path.set('/queryBlogCount', queryBlogCount)

function queryBlogByTag(req, res) {
    var params = url.parse(req.url, true).query;
    var data = [];
    editBlogDao.queryBlogByTag(params.tag, function (result) {
        var data = result.reverse();
        var len = data.length;
        for (var i = 0; i < len; i ++) {
            data[i].ctime = timeUtil.dateFormat(data[i].ctime);
            data[i].tags = data[i].tags.split(',');
            data[i].content = data[i].content.replace(/<img[\W\w]*">/g, '');
            data[i].content = data[i].content.replace(/<[\W\w]{1,5}>/g, '');
            data[i].content = data[i].content.replace(/&nbsp;/g, '');
            data[i].content = data[i].content.substring(0, 300) + '...'
        };
        res.writeHead(200);
        res.write(respUtil.createResult('success', '查询成功', data));
        res.end();
    });
};
path.set('/queryBlogByTag', queryBlogByTag);

function queryBlogById(req, res) {
    var blogArr = []
    var params = url.parse(req.url, true).query;
    blogArr.push(params.bid);
        editBlogDao.queryBlogByBlogId(blogArr, function (result) {
            try {
                result[0].ctime = timeUtil.dateFormat(result[0].ctime);
                res.writeHead(200);
                res.write(respUtil.createResult('success', '通过id查询文章成功', result));
            } catch (e) {
                res.redirect('../page/error.html');
            }
            res.end();
        })

};
path.set('/queryBlogById', queryBlogById);

function queryBlogByKey(req, res) {
    var params = url.parse(req.url, true).query;
    siteMap.queryAllBlog( function (result) {
        var len = result.length;
        var data = [];
        for (var i = 0; i < len; i ++) {
            if (result[i].title.indexOf(params.key) > -1 || result[i].content.indexOf(params.key) > -1) {
                result[i].ctime = timeUtil.dateFormat(result[i].ctime);
                result[i].tags = result[i].tags.split(',');
                result[i].content = result[i].content.replace(/<img[\W\w]*">/g, '');
                result[i].content = result[i].content.replace(/<[\W\w]{1,5}>/g, '');
                result[i].content = result[i].content.replace(/&nbsp;/g, '');
                result[i].content = result[i].content.substring(0, 300) + '...';
                data.push(result[i]);
            }
        }
        data.reverse();
        res.writeHead(200);
        res.write(respUtil.createResult('success', '通过id查询文章成功', data))
        res.end();
    })
};
path.set('/queryBlogByKey', queryBlogByKey);

function queryBlogByViews(req, res) {
    editBlogDao.queryBlogByViews(function (result) {
        res.writeHead(200);
        res.write(respUtil.createResult('success', '查询成功', result))
        res.end();
    })
};
path.set('/queryBlogByViews', queryBlogByViews);

function updateBlogViews(req, res) {
    var params = url.parse(req.url, true).query;
    editBlogDao.updateBlogViews(parseInt(params.blogId), function (result) {
        res.writeHead(200);
        res.write(respUtil.createResult('success', '通过id查询文章成功', null))
        res.end();
    })
};
path.set('/updateBlogViews', updateBlogViews);

module.exports = path;