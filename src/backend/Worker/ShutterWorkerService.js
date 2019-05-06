var srs = require('../ShutterDAO')
const collection = 'Orders'

async function readOrders() {
    const data = {"submitted": "submitted", "selected": {$exists: false}}
    return (await srs.readWithData(collection, data))
}

async function selectOrder(data) {
    const where = {"customerID": data.customerID, "windowID": data.windowID}
    srs.updateOne(collection, where, {$set: {"selected" : data.workerID}})
}

async function addParts(data) {
    const where = {"customerID": data.customerID, "windowID": data.windowID, "selected": data.workerID}
    srs.updateOne(collection, where, {$push: data})
}

module.exports = {
    "readReady": readOrders,
    "selectOrder": selectOrder
}
