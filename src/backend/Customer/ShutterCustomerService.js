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

async function insertCustomer(customer) {

    if (await srs.counter(collection, {"customerID": customer.customerID}) === 0) {
        srs.insert(collection, customer)
        return 'Customer is added'
    } else {
        throw 'The username is used, please select another!'
    }

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
    if (await srs.counter(collection, {"customerID": data.customerID}) === 1) {
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
            return 'New order created, and items added!'
        } else {
            insertOrderElement(data);
            return 'Item added to the order!'
        }
    } else {
        throw 'This user is not exists, cant order!'
    }
}

async function submitOrder(data) {
    if(await srs.counter("Orders", {"customerID": data.customerID, "orderID": data.orderID, "submitted": "no"}) === 1){
        const where = {"customerID": data.customerID, "orderID": data.orderID}
        const submit = {$set: {"submitted": "submitted"}}
        srs.updateOne("Orders", where, submit)
        return 'Order is submitted!'
    }
    else {
        throw 'This order is already submitted!'
    }

}

async function pay(data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID, "status": "readyToPay"}
    const pay = {$set: {"payed": "payed"}}
    if(await srs.counter("Orders", {"customerID": data.customerID, "orderID": data.orderID, "status": "readyToPay"})===1){
        srs.updateOne("Orders", where, pay)
        srs.updateOne("Receipts", where, pay)
        return 'The order is payed!'
    }
    else {
        throw 'This order is not ready to pay!'
    }
}

module.exports = {
    "readAll": readAll,
    "readCustomer": readCustomer,
    "addCustomer": insertCustomer,
    "addOrder": insertOrder,
    "submitOrder": submitOrder,
    "pay": pay
}
