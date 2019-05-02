var srs = require('./ShutterCustomerDAO')

async function readAll() {
    return (await srs.readAll())
}

module.exports = {
    "readAll" : readAll
}
