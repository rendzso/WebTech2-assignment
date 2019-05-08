var srs = require('../ShutterDAO')
const collection = 'Orders'

async function readAll() {
    return (await srs.readAll(collection))
}

async function readReadyToReceipt() {
    return (await srs.readWithData(collection, {"status": "creatingReceipt"}))
}

async function readReadyToOrganize() {
    return (await srs.readWithData(collection, {"status": "organize"}))
}

function organizeInstallation(data) {
    srs.updateOne(collection, {
        "customerID": data.customerID,
        "orderID": data.orderID
    }, {$set: {"deliveryTime": data.date, "status": "creatingReceipt"}})
}

async function createReceipt(data) {
    const order = await srs.readWithData(collection, {
        "customerID": data.customerID,
        "orderID": data.orderID,
        "status": "creatingReceipt"
    })

    if (order.length !== 0) {
        let all = 0
        for (let entity of order[0]["items"]) {
            all += entity["shutterPrice"]
        }

        let itemList = await srs.readWithData(collection, {
                "customerID": data.customerID,
                "orderID": data.orderID
            }
        )

        const j = itemList[0].items.length
        delete itemList[0]._id;
        for (let i = 0; i < j; i++) {
            delete itemList[0].items[i].shutterParts;
            delete itemList[0].items[i].worker;
            delete itemList[0].items[i].shutterStatus;
        }
        delete itemList[0].submitted;
        delete itemList[0].status;
        delete itemList[0].payed;

        srs.insert("Receipts", {
            "customerID": data.customerID,
            "orderID": data.orderID,
            "total": all,
            "dateline": "2019.05.30.",
            "payed": "no",
            "itemList": itemList[0]
        })

        srs.updateOne(collection, {
            "customerID": data.customerID,
            "orderID": data.orderID
        }, {$set: {"status": "readyToPay"}})
    }
}

module.exports = {
    "listAll": readAll,
    "listReadyToReceipt": readReadyToReceipt,
    "listReadyToOrganize": readReadyToOrganize,
    "setDeliveryTime": organizeInstallation,
    "createReceipt": createReceipt
}
