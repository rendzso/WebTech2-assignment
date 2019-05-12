var srs = require('../ShutterDAO')
const collection = 'Customer'
var winston = require('winston')
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'customer-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

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

async function readAll(customerID) {
    return (await srs.readWithData(collection, {"customerID": customerID}))
}

async function readCustomerOrders(customerID) {
    const data = {"customerID": customerID}
    logger.info("readCustomerOrders request were found!")
    return (await srs.readWithData("Orders", data))
}

async function readCustomerReceipts(customerID) {
    const data = {"customerID": customerID}
    logger.info("readCustomerReceipts request were found!")
    return (await srs.readWithData("Receipts", data))
}

async function insertCustomer(customer) {

    if (await srs.counter(collection, {"customerID": customer.customerID}) === 0) {
        srs.insert(collection, customer)
        logger.info("insertCustomer request were found, customer added!")
        return 'Customer is added'
    } else {
        logger.error("insertCustomer request were found, but customerID is used!")
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
            logger.info("insertOrder request were found, and new order created, and items added!")
            return 'New order created, and items added!'
        } else {
            insertOrderElement(data);
            logger.info("insertOrder request were found, and items added to the order!")
            return 'Item added to the order!'
        }
    } else {
        logger.error("insertOrder request were found, but the user does not exists!")
        throw 'This user is not exists, cant order!'
    }
}

async function submitOrder(data) {
    if(await srs.counter("Orders", {"customerID": data.customerID, "orderID": data.orderID, "submitted": "no"}) === 1){
        const where = {"customerID": data.customerID, "orderID": data.orderID}
        const submit = {$set: {"submitted": "submitted"}}
        srs.updateOne("Orders", where, submit)
        logger.info("submitOrder request were found, and order is submitted!")
        return 'Order is submitted!'
    }
    else {
        logger.error("submitOrder request were found, but the order is already submitted!")
        throw 'This order is already submitted!'
    }

}

async function pay(data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID, "status": "readyToPay"}
    const pay = {$set: {"payed": "payed"}}
    if(await srs.counter("Orders", {"customerID": data.customerID, "orderID": data.orderID, "status": "readyToPay"})===1){
        srs.updateOne("Receipts", {"customerID": data.customerID, "orderID": data.orderID}, {$set: {"payed": "payed"}})
        srs.updateOne("Orders", where, {$set: {"payed": "payed", "status": "done"}})
        logger.info("pay request were found, order is payed!")
        return 'The order is payed!'
    }
    else {
        logger.error("pay request were found, but the order is not ready to pay!")
        throw 'This order is not ready to pay!'
    }
}

module.exports = {
    "readAll": readAll,
    "readCustomerOrders": readCustomerOrders,
    "addCustomer": insertCustomer,
    "addOrder": insertOrder,
    "submitOrder": submitOrder,
    "pay": pay,
    "readCustomerReceipts": readCustomerReceipts
}
