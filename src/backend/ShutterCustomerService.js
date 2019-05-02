var srs = require('./ShutterCustomerDAO')

async function readAll() {
    return (await srs.readAll())
}

async function readUser(customerID) {
    return (await srs.readUser(customerID))
}

module.exports = {
    "readAll" : readAll,
    "readUser" : readUser
}
