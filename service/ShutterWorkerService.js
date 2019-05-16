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
        this.DAO = require('../dao/ShutterWorkerDAO')
    }
}

ShutterWorkerService.prototype.readOrders = async function (worker, status) {
        logger.info("readOrders request were found!")
        return (await this.DAO.readAvailableWorks(worker, status))
    }

ShutterWorkerService.prototype.selectOrder = async function (data) {
    return (await this.DAO.selectOrder(data))
}

ShutterWorkerService.prototype.successOrder = async function (data) {
    return (await this.DAO.successOrder(data))
}

module.exports = ShutterWorkerService
