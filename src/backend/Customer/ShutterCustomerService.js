var srs = require('../ShutterDAO')
const collection = 'Customer'

async function readAll() {
    return (await srs.readAll(collection))
}

async function readCustomer(customerID) {
    const data = {"customerID" : customerID}
    return (await srs.readWithData(collection, data))
}

async function insertCustomer(customer) {
    srs.insert(collection, customer)
}

async function insertWindow(data) {
    srs.insert("Orders", data)
}

async function insertShutter(data) {
    const customerwindow = {"customerID" : data.customerID, "windowID": data.windowID}
    const shutter = {$set: {"shutter": data.shutter}}
    srs.updateOne("Orders", customerwindow, shutter)
}

async function submitOrder(data) {
    const customerwindow = {"customerID" : data.customerID, "windowID": data.windowID, "shutter": {$exists: true}}
    const submit = {$set: {"submitted": "submitted"}}
    srs.updateOne("Orders", customerwindow, submit)
}

module.exports = {
    "readAll" : readAll,
    "readCustomer" : readCustomer,
    "addCustomer" : insertCustomer,
    "addWindow" : insertWindow,
    "addShutter" : insertShutter,
    "submitOrder" : submitOrder
}
