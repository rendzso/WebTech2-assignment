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
        this.DAO = require('../dao/ShutterCustomerDAO')
    }
}

ShutterCustomerService.prototype.readAll = async function (customerID) {
    return (await this.DAO.readAll(customerID))
}

ShutterCustomerService.prototype.readCustomerOrders = async function (customerID) {
    logger.info("readCustomerOrders request were found!")
    return (await this.DAO.readOrders(customerID))
}

ShutterCustomerService.prototype.readCustomerReceipts = async function (customerID) {
    logger.info("readCustomerReceipts request were found!")
    return (await this.DAO.readreceipts(customerID))
}

ShutterCustomerService.prototype.insertCustomer = async function (customer) {
    return (await this.DAO.insertCustomer(customer))
}

ShutterCustomerService.prototype.insertOrder = async function (data) {
    return (await this.DAO.insertOrder(data))
}

ShutterCustomerService.prototype.submitOrder = async function (data) {
    return (await this.DAO.submitOrder(data))
}

ShutterCustomerService.prototype.pay = async function (data) {
    return (await this.DAO.pay(data))
}

module.exports = ShutterCustomerService;
