var srs = require('../ShutterDAO')
const collection = 'Orders'

async function readOrders() {
    const all = await srs.readAll(collection, {"submitted": "submitted"})
    if (all.length !== 0) {
        let result = []
        for (let entity of all) {
            if (entity["items"].length !== 0) {
                for (let item of entity["items"]) {
                    if (item["worker"] === "none") {
                        const filtered = {};
                        filtered["customerID"] = entity["customerID"];
                        filtered["orderID"] = entity["orderID"];
                        filtered["items"] = item;
                        result.push(filtered)
                    }
                }
            }
        }
        return (result)
    }
}

async function checkEverything(customerID, orderID) {
    const data = await srs.readWithData(collection, {"customerID": customerID, "orderID": orderID})
    let all = 0
    let ready = 0
    console.log(data)
    for (let entity of data[0]["items"]) {
        all += 1
        if (entity["shutterStatus"] === "success") {
            ready += 1
        }
    }

    console.log("all: " + all)
    console.log("ready: " + ready)
    if(all === ready){
        console.log("The whole order is ready.")
        srs.updateOne(collection, {"customerID": customerID, "orderID": orderID}, {$set: {"status": "organize"}})
    }
}

async function selectOrder(data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID, "items.itemID": data.itemID}
    srs.updateOne(collection, where, {$set: {"items.$.worker": data.worker, "items.$.shutterStatus": "inProgress"}})
}

async function successOrder(data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID, "items.itemID": data.itemID}
    await srs.updateOne(collection, where, {$set: {"items.$.shutterStatus": "success"}})
    checkEverything(data.customerID, data.orderID)
}

module.exports = {
    "readReady": readOrders,
    "selectOrder": selectOrder,
    "successOrder": successOrder
}
