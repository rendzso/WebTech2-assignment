const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://172.21.0.10:27017';

const dbName = 'Shutter';
const collection = 'Orders';

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

function readReceipts() {
    return new Promise(async resolve => {
        const client = new MongoClient(url);
        await client.connect((err) => {
            assert.equal(err, null);
            var db = client.db(dbName);
            resolve(db.collection('Receipts').find().toArray());
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

async function insert(collection, data){
    const client = new MongoClient(url);
    await client.connect((err, r) => {
        assert.equal(err, null);
        var db = client.db(dbName);
        db.collection(collection).insertOne(data);
        client.close();
    });
}

async function readReadyToReceipt(){
    return (await read(collection, {"status": "creatingReceipt"}))
}

async function readReadyToOrganize(){
    return (await read(collection, {"status": "organize"}))
}

async function organizeInstallation(data){
    if (await counter(collection, {"customerID": data.customerID, "orderID": data.orderID, "status" : "organize"}) === 1) {
        updateOne(collection, {
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

async function createReceipt(data) {
    let order = await read(collection, {
        "customerID": data.customerID,
        "orderID": data.orderID,
        "status": "creatingReceipt"
    })

    if (order.length !== 0) {
        let all = 0
        for (let entity of order[0]["items"]) {
            all += entity["shutterPrice"]
        }

        const customer = await read("Customer", {
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

        insert("Receipts", {
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

        updateOne(collection, {
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

module.exports = {
    "readAll" : read,
    "readReadyToReceipt": readReadyToReceipt,
    "readReadyToOrganize": readReadyToOrganize,
    "organizeInstallation": organizeInstallation,
    "createReceipt": createReceipt,
    "readReceipts": readReceipts
}
