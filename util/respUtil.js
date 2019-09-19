function createResult(status, msg, data) {
    return JSON.stringify({status: status, msg: msg, data: data})
}

module.exports.createResult = createResult;