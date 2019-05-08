var srs = require('../ShutterDAO')
const collection = 'Orders'

async function readOrders(worker, status) {
    const all = await srs.readAll(collection, {"submitted": "submitted"})
    if (all.length !== 0) {
        let result = []
        for (let entity of all) {
            if (entity["items"].length !== 0) {
                for (let item of entity["items"]) {
                    if (item["worker"] === worker && item["shutterStatus"] !== status) {
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
    if (all === ready) {
        srs.updateOne(collection, {"customerID": customerID, "orderID": orderID}, {$set: {"status": "organize"}})
        return 1
    } else {
        return 0
    }
}

async function selectOrder(data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID, "items.itemID": data.itemID}
    if (await srs.counter(collection, where) === 1) {
        srs.updateOne(collection, where, {$set: {"items.$.worker": data.worker, "items.$.shutterStatus": "inProgress"}})
        return 'Item selected!'
    } else {
        throw 'Cannot find the item, or the order is not submitted!'
    }


}

async function successOrder(data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID, "items.itemID": data.itemID}
    if (await srs.counter(collection, where) === 1) {
    await srs.updateOne(collection, where, {$set: {"items.$.shutterStatus": "success"}})
    if(await checkEverything(data.customerID, data.orderID)===1){
        return 'The whole order is ready for organize!'
    } else {
        return 'The item is ready!'
    }
    } else {
        throw 'Cannot find the work!'
    }
}

module.exports = {
    "readReady": readOrders,
    "selectOrder": selectOrder,
    "successOrder": successOrder
}
