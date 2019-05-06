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
    const customer = {"customerID" : data.customerID}
    const window = {$push: {"windows": data.window}}
    srs.updateOne(collection, customer, window)
}

async function insertShutter(data) {
    const customerwindow = {"customerID" : data.customerID, "windows":{$elemMatch: {"windowID": data.windowID}}}
    const shutter = {$set: {"windows.$.windowData.shutter": data.shutter}}
    srs.updateOne(collection, customerwindow, shutter)
}

async function submitOrder(data) {
    const customerwindow = {"customerID" : data.customerID, "windows":{$elemMatch: {"windowID": data.windowID}}}
    const submit = {$set: {"windows.$.windowData.submitted": "submitted"}}
    srs.updateOne(collection, customerwindow, submit)
}

module.exports = {
    "readAll" : readAll,
    "readCustomer" : readCustomer,
    "addCustomer" : insertCustomer,
    "addWindow" : insertWindow,
    "addShutter" : insertShutter,
    "submitOrder" : submitOrder
}
