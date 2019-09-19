var mysql = require('mysql');

function createConnection() {
    return mysql.createConnection({
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: 'qq5179208.',
        database: 'myblog',
    })
}
module.exports.createConnection = createConnection;