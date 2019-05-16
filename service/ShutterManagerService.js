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
        this.DAO = require('../dao/ShutterManagerDAO')
    }
}

ShutterManagerService.prototype.readAll = async function () {
    logger.info("readAll request were found!")
    return (await this.DAO.readAll(collection))
}

ShutterManagerService.prototype.readReadyToReceipt = async function () {
    logger.info("readReadyToReceipt request were found!")
    return (await this.DAO.readReadyToReceipt())
}

ShutterManagerService.prototype.readReadyToOrganize = async function () {
    logger.info("readReadyToOrganize request were found!")
    return (await this.DAO.readReadyToOrganize())
}

ShutterManagerService.prototype.organizeInstallation = async function (data) {
    return (await this.DAO.organizeInstallation(data))
}

ShutterManagerService.prototype.createReceipt = async function (data) {
    return (await this.DAO.createReceipt(data))
}

ShutterManagerService.prototype.getCustomerWithMoney = async function (){
    let data =await this.DAO.readReceipts();
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
