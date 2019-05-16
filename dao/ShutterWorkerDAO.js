const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://172.21.0.10:27017';

const dbName = 'Shutter';
const collection = 'Orders';

const moment = require('moment')
var winston = require('winston')
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'manager-service'},
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'})
    ]
});

function read(collection, data) {
    return new Promise(async resolve => {
        const client = new MongoClient(url);
        await client.connect((err) => {
            assert.equal(err, null);
            var db = client.db(dbName);
            resolve(db.collection(collection).find(data).toArray());
            client.close();
        });
    });
}

function counter(collection, data) {
    return new Promise(async resolve => {
        const client = new MongoClient(url);
        await client.connect((err) => {
            assert.equal(err, null);
            var db = client.db(dbName);
            resolve(db.collection(collection).find(data).count());
            client.close();
        });
    });
}

async function updateOne(collection, where, what){
    const client = new MongoClient(url);
    await client.connect((err) => {
        assert.equal(err, null);
        var db = client.db(dbName);
        db.collection(collection).updateOne(where, what);
        client.close();
    });
}

async function readSubmittedOrders(worker, status) {
    const all = await read(collection, {"submitted": "submitted"})
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
        return result;
    }
}

async function selectOrder(data){
    const where = {"customerID": data.customerID, "orderID": data.orderID, "items.itemID": data.itemID}
    if (await counter(collection, where) === 1) {
        updateOne(collection, where, {$set: {"items.$.worker": data.worker, "items.$.shutterStatus": "inProgress"}})
        logger.info("selectOrder request were found, item selected!")
        return 'Item selected!'
    } else {
        logger.error("selectOrder request were found, but the order is not submitted!")
        throw 'Cannot find the item, or the order is not submitted!'
    }
}

async function checkEverything(customerID, orderID){
    const data = await read(collection, {"customerID": customerID, "orderID": orderID})
    let all = 0
    let ready = 0
    for (let entity of data[0]["items"]) {
        all += 1
        if (entity["shutterStatus"] === "success") {
            ready += 1
        }
    }

    if (all === ready) {
        updateOne(collection, {"customerID": customerID, "orderID": orderID}, {$set: {"status": "organize"}})
        return 1
    } else {
        return 0
    }
}

async function successOrder(data){
    const where = {"customerID": data.customerID, "orderID": data.orderID, "items.itemID": data.itemID}
    if (await counter(collection, where) === 1) {
        await updateOne(collection, where, {$set: {"items.$.shutterStatus": "success"}})
        if(await checkEverything(data.customerID, data.orderID)===1){
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

module.exports ={
    "readAvailableWorks": readSubmittedOrders,
    "selectOrder": selectOrder,
    "successOrder": successOrder
}
