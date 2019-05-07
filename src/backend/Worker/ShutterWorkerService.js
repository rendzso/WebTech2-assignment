var srs = require('../ShutterDAO')
const collection = 'Orders'

async function readOrders() {
    const all = await srs.readAll(collection, {"submitted": "yes"})
    const items = all[0]["items"]
    let result = []
    for(let entity of items){
        if(entity["worker"] === "none"){
            entity["customerID"] = all.customerID
            result.push(entity)
        }
    }
    console.log(result)

}

async function selectOrder(data) {
    const where = {"customerID": data.customerID, "windowID": data.windowID}
    srs.updateOne(collection, where, {$set: {"selected" : data.workerID}})
}

module.exports = {
    "readReady": readOrders,
    "selectOrder": selectOrder
}
