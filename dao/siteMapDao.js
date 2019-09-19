var dbutil = require('./DButil');

function queryAllBlog(success) {
    var connection = dbutil.createConnection();
    connection.connect();
    var querySql = 'select * from blog;';
    connection.query(querySql, function (error, result) {
        if (error === null) {
            success(result);
        }else{
            console.log(error);
        }
    })
    connection.end()
}
module.exports = {
    'queryAllBlog' : queryAllBlog,
}