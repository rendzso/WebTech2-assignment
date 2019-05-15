const collection = 'Orders'
const moment =require('moment')
var winston = require('winston')
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'manager-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

function ShutterManagerService(DAO){
    if(DAO !== undefined && DAO !== null){
        this.DAO = DAO;
    } else {
        this.DAO = require('../dao/ShutterDAO')
    }
}

ShutterManagerService.prototype.readAll = async function () {
    logger.info("readAll request were found!")
    return (await this.DAO.readAll(collection))
}

ShutterManagerService.prototype.readReadyToReceipt = async function () {
    logger.info("readReadyToReceipt request were found!")
    return (await this.DAO.readWithData(collection, {"status": "creatingReceipt"}))
}

ShutterManagerService.prototype.readReadyToOrganize = async function () {
    logger.info("readReadyToOrganize request were found!")
    return (await this.DAO.readWithData(collection, {"status": "organize"}))
}

ShutterManagerService.prototype.organizeInstallation = async function (data) {

    if (await this.DAO.counter(collection, {"customerID": data.customerID, "orderID": data.orderID, "status" : "organize"}) === 1) {
        this.DAO.updateOne(collection, {
            "customerID": data.customerID,
            "orderID": data.orderID
        }, {$set: {"deliveryTime": data.date, "status": "creatingReceipt"}})
        logger.info("organizeInstallation request were found, delivery time added!")
        return 'Delivery time is added!'
    } else {
        logger.error("organizeInstallation request were found, but the order is not ready to organize!")
        throw 'The order is not ready to organize!!'
    }


}

ShutterManagerService.prototype.createReceipt = async function (data) {
    let order = await this.DAO.readWithData(collection, {
        "customerID": data.customerID,
        "orderID": data.orderID,
        "status": "creatingReceipt"
    })

    if (order.length !== 0) {
        let all = 0
        for (let entity of order[0]["items"]) {
            all += entity["shutterPrice"]
        }

        const customer = await this.DAO.readWithData("Customer", {
                "customerID": data.customerID
            }
        )

        const j = order[0].items.length
        delete order[0]._id;
        for (let i = 0; i < j; i++) {
            delete order[0].items[i].shutterParts;
            delete order[0].items[i].worker;
            delete order[0].items[i].shutterStatus;
        }
        delete order[0].submitted;
        delete order[0].status;
        delete order[0].payed;

        this.DAO.insert("Receipts", {
            "customerID": data.customerID,
            "name" : customer[0].name,
            "phone":customer[0].phone,
            "address":customer[0].place,
            "orderID": data.orderID,
            "total": all,
            "dateline": moment().add(10, 'days').format('YYYY.MM.DD'),
            "payed": "readyToPay",
            "order": order[0]
        })

        this.DAO.updateOne(collection, {
            "customerID": data.customerID,
            "orderID": data.orderID
        }, {$set: {"status": "readyToPay"}})

        logger.info("createReceipt request were found, and receipt is created!")
        return 'Receipt created, and order status changed to: ready to pay!'
    } else {
        logger.error("createReceipt request were found, but the order is not ready!")
        return 'The order is not ready! Cannot create receipt! Wait for workers to success!'
    }
}

ShutterManagerService.prototype.getCustomerWithMoney = async function (){
    let data =await this.DAO.readAll("Receipts")
    let customerlist = []
    let statistic = []
    for(let receipt of data){
        if(customerlist.indexOf(receipt.customerID) === -1){
            customerlist.push(receipt.customerID)
        }
    }
    for (let customer of customerlist){
        let total = 0
        for(let receipt of data){
            if(customer === receipt.customerID){
                total += receipt.total
            }
        }
        statistic.push({"y": total , "x":customer})
    }

    logger.info("Statistic created!")
    return statistic
}

module.exports = ShutterManagerService
