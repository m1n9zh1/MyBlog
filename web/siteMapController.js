var siteMapDao = require('../dao/siteMapDao');
var respUtil = require('../util/respUtil');
var path = new Map();

function queryAllBlog(request, response) {
    siteMapDao.queryAllBlog(function (result) {
        result.reverse();
        response.writeHead(200);
        response.write(respUtil.createResult('success', '查询成功', result))
        response.end();
    })



}
path.set('/queryAllBlog', queryAllBlog);

module.exports = path;