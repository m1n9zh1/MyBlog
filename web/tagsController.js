var tagDao = require('../dao/tagDao');
var respUtil = require('../util/respUtil');
var path = new Map();

function queryTags(request, response) {
    tagDao.queryTags(function (result) {
        response.writeHead(200);
        response.write(respUtil.createResult('success', '查询成功', result))
        response.end();
    })
}
path.set('/queryTags', queryTags);

module.exports = path;