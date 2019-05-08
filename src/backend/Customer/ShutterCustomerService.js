var srs = require('../ShutterDAO')
const collection = 'Customer'

async function generate(customerID) {
    return new Promise(async resolve => {
        const basic = "order"
        let number = 1
        const circle = await srs.counter("Orders", {"customerID": customerID})
        for (let i = 0; i <= circle; i++) {
            if (await srs.counter("Orders", {"customerID": customerID, "orderID": basic + number}) === 0) {
                resolve(basic + number)
            } else {
                number += 1;
            }
        }
    })
}

async function generateItem(customerID) {
    const basic = "item"
    const all = await srs.readWithData("Orders", {"customerID": customerID, "submitted": "no"})
    if (all.length !== 0) {
        const items = all[0]["items"]
        const thenumber = items.length + 1
        return basic + thenumber
    } else {
        const thenumber = 1;
        return basic + thenumber
    }

}

async function readAll() {
    return (await srs.readAll(collection))
}

async function readCustomer(customerID) {
    const data = {"customerID": customerID}
    return (await srs.readWithData(collection, data))
}

function insertCustomer(customer) {
    srs.insert(collection, customer)
}

async function insertOrderElement(data) {
    const secondary = await srs.readWithData("Parts", {"type": data.shutterType})
    const itemID = await generateItem(data.customerID)
    srs.updateOne("Orders", {"customerID": data.customerID, "submitted": "no"}, {
        $push: {
            "items": {
                "itemID": itemID,
                "windowHeight": data.windowHeight,
                "windowWidth": data.windowWidth,
                "shutterType": data.shutterType,
                "shutterColor": data.shutterColor,
                "shutterParts": secondary[0]["parts"],
                "shutterPrice": secondary[0]["price"],
                "worker": "none",
                "shutterStatus": "waiting"
            }
        }
    })
}

async function insertOrder(data) {
    if (await srs.counter("Orders", {"customerID": data.customerID, "submitted": "no"}) === 0) {
        const secondary = await srs.readWithData("Parts", {"type": data.shutterType})
        const ID = await generate(data.customerID)
        const itemID = await generateItem(data.customerID)
        srs.insert("Orders", {
                "customerID": data.customerID,
                "orderID": ID,
                "items": [{
                    "itemID": itemID,
                    "windowHeight": data.windowHeight,
                    "windowWidth": data.windowWidth,
                    "shutterType": data.shutterType,
                    "shutterColor": data.shutterColor,
                    "shutterParts": secondary[0]["parts"],
                    "shutterPrice": secondary[0]["price"],
                    "worker": "none",
                    "shutterStatus": "waiting"
                }],
                "submitted": "no",
                "status": "inProgress",
                "deliveryTime": "notDefined",
                "payed": "no"
            }
        )
    } else {
        insertOrderElement(data);
    }
}

function submitOrder(data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID}
    const submit = {$set: {"submitted": "submitted"}}
    srs.updateOne("Orders", where, submit)
}

function pay(data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID}
    const pay = {$set: {"payed": "payed"}}
    srs.updateOne("Orders", where, pay)
    srs.updateOne("Receipts", where, pay)
}

module.exports = {
    "readAll": readAll,
    "readCustomer": readCustomer,
    "addCustomer": insertCustomer,
    "addOrder": insertOrder,
    "submitOrder": submitOrder,
    "pay" : pay
}
