const collection = 'Orders'
var winston = require('winston')
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'worker-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

function ShutterWorkerService(DAO){
    if(DAO !== undefined && DAO !== null){
        this.DAO = DAO;
    } else {
        this.DAO = require('../ShutterDAO')
    }
}

ShutterWorkerService.prototype.readOrders = async function (worker, status) {
    const all = await this.DAO.readAll(collection, {"submitted": "submitted"})
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
        logger.info("readOrders request were found!")
        return (result)
    }
}

ShutterWorkerService.prototype.checkEverything = async function (customerID, orderID) {
    const data = await this.DAO.readWithData(collection, {"customerID": customerID, "orderID": orderID})
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
        this.DAO.updateOne(collection, {"customerID": customerID, "orderID": orderID}, {$set: {"status": "organize"}})
        return 1
    } else {
        return 0
    }
}

ShutterWorkerService.prototype.selectOrder = async function (data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID, "items.itemID": data.itemID}
    if (await this.DAO.counter(collection, where) === 1) {
        this.DAO.updateOne(collection, where, {$set: {"items.$.worker": data.worker, "items.$.shutterStatus": "inProgress"}})
        logger.info("selectOrder request were found, item selected!")
        return 'Item selected!'
    } else {
        logger.error("selectOrder request were found, but the order is not submitted!")
        throw 'Cannot find the item, or the order is not submitted!'
    }


}

ShutterWorkerService.prototype.successOrder = async function (data) {
    const where = {"customerID": data.customerID, "orderID": data.orderID, "items.itemID": data.itemID}
    if (await this.DAO.counter(collection, where) === 1) {
    await this.DAO.updateOne(collection, where, {$set: {"items.$.shutterStatus": "success"}})
    if(await this.checkEverything(data.customerID, data.orderID)===1){
        logger.info("successOrder request were found, the whole order is ready!")
        return 'The whole order is ready for organize!'
    } else {
        logger.info("successOrder request were found, the item is ready!")
        return 'The item is ready!'
    }
    } else {
        logger.error("successOrder request were found, but cannot find the work!")
        throw 'Cannot find the work!'
    }
}

module.exports = ShutterWorkerService
