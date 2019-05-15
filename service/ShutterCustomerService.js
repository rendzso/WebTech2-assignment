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

function ShutterCustomerService(DAO){
    if(DAO !== undefined && DAO !== null){
      this.DAO = DAO;
    } else {
        this.DAO = require('../dao/ShutterDAO')
    }
}

ShutterCustomerService.prototype.generate = async function (customerID) {
    return new Promise(async resolve => {
        const basic = "order"
        let number = 1
        const circle = await this.DAO.counter("Orders", {"customerID": customerID})
        for (let i = 0; i <= circle; i++) {
            if (await this.DAO.counter("Orders", {"customerID": customerID, "orderID": basic + number}) === 0) {
                resolve(basic + number)
            } else {
                number += 1;
            }
        }
    })
}

ShutterCustomerService.prototype.generateItem = async function (customerID) {
    const basic = "item"
    const all = await this.DAO.readWithData("Orders", {"customerID": customerID, "submitted": "no"})
    if (all.length !== 0) {
        const items = all[0]["items"]
        const thenumber = items.length + 1
        return basic + thenumber
    } else {
        const thenumber = 1;
        return basic + thenumber
    }

}

ShutterCustomerService.prototype.readAll = async function (customerID) {
    return (await this.DAO.readWithData(collection, {"customerID": customerID}))
}

ShutterCustomerService.prototype.readCustomerOrders = async function (customerID) {
    const data = {"customerID": customerID}
    logger.info("readCustomerOrders request were found!")
    return (await this.DAO.readWithData("Orders", data))
}

ShutterCustomerService.prototype.readCustomerReceipts = async function (customerID) {
    const data = {"customerID": customerID}
    logger.info("readCustomerReceipts request were found!")
    return (await this.DAO.readWithData("Receipts", data))
}

ShutterCustomerService.prototype.insertCustomer = async function (customer) {

    if (await this.DAO.counter(collection, {"customerID": customer.customerID}) === 0) {
        this.DAO.insert(collection, customer)
        logger.info("insertCustomer request were found, customer added!")
        return 'Customer is added'
    } else {
        logger.error("insertCustomer request were found, but customerID is used!")
        throw 'The username is used, please select another!'
    }

}

ShutterCustomerService.prototype.insertOrderElement = async function (data) {
    const secondary = await this.DAO.readWithData("Parts", {"type": data.shutterType})
    const itemID = await this.generateItem(data.customerID)
    this.DAO.updateOne("Orders", {"customerID": data.customerID, "submitted": "no"}, {
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

ShutterCustomerService.prototype.insertOrder = async function (data) {
    if (await this.DAO.counter(collection, {"customerID": data.customerID}) === 1) {
        if (await this.DAO.counter("Orders", {"customerID": data.customerID, "submitted": "no"}) === 0) {
            const secondary = await this.DAO.readWithData("Parts", {"type": data.shutterType})
            const ID = await this.generate(data.customerID)
            const itemID = await this.generateItem(data.customerID)
            this.DAO.insert("Orders", {
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
            this.insertOrderElement(data);
            logger.info("insertOrder request were found, and items added to the order!")
            return 'Item added to the order!'
        }
    } else {
        logger.error("insertOrder request were found, but the user does not exists!")
        throw 'This user is not exists, cant order!'
    }
}

ShutterCustomerService.prototype.submitOrder = async function (data) {
    if(await this.DAO.counter("Orders", {"customerID": data.customerID, "orderID": data.orderID, "submitted": "no"}) === 1){
        const where = {"customerID": data.customerID, "orderID": data.orderID}
        const submit = {$set: {"submitted": "submitted"}}
        this.DAO.updateOne("Orders", where, submit)
        logger.info("submitOrder request were found, and order is submitted!")
        return 'Order is submitted!'
    }
    else {
        logger.error("submitOrder request were found, but the order is already submitted!")
        throw 'This order is already submitted!'
    }

}

ShutterCustomerService.prototype.pay = async function (data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID, "status": "readyToPay"}
    const pay = {$set: {"payed": "payed"}}
    if(await this.DAO.counter("Orders", {"customerID": data.customerID, "orderID": data.orderID, "status": "readyToPay"})===1){
        this.DAO.updateOne("Receipts", {"customerID": data.customerID, "orderID": data.orderID}, {$set: {"payed": "payed"}})
        this.DAO.updateOne("Orders", where, {$set: {"payed": "payed", "status": "done"}})
        logger.info("pay request were found, order is payed!")
        return 'The order is payed!'
    }
    else {
        logger.error("pay request were found, but the order is not ready to pay!")
        throw 'This order is not ready to pay!'
    }
}

module.exports = ShutterCustomerService;
