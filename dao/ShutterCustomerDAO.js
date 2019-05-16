const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://172.21.0.10:27017';

const dbName = 'Shutter';
const collection = 'Customer';

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

async function insert(collection, data){
    const client = new MongoClient(url);
    await client.connect((err, r) => {
        assert.equal(err, null);
        var db = client.db(dbName);
        db.collection(collection).insertOne(data);
        client.close();
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

async function readAll(customerID){
    return (await read(collection, {"customerID": customerID}))
}

async function readOrders(customerID){
    return (await read('Orders', {"customerID": customerID}))
}

async function readReceipts(customerID){
    return (await read("Receipts", {"customerID": customerID}))
}

async function insertCustomer(data){
    if (await counter(collection, {"customerID": data.customerID}) === 0) {
        insert(collection, data)
        logger.info("insertCustomer request were found, customer added!")
        return 'Customer is added'
    } else {
        logger.error("insertCustomer request were found, but customerID is used!")
        throw 'The username is used, please select another!'
    }
}

async function generate(customerID){
    return new Promise(async resolve => {
        const basic = "order"
        let number = 1
        const circle = await counter("Orders", {"customerID": customerID})
        for (let i = 0; i <= circle; i++) {
            if (await counter("Orders", {"customerID": customerID, "orderID": basic + number}) === 0) {
                resolve(basic + number)
            } else {
                number += 1;
            }
        }
    })
}

async function generateItem(customerID){
    const basic = "item"
    const all = await read("Orders", {"customerID": customerID, "submitted": "no"})
    if (all.length !== 0) {
        const items = all[0]["items"]
        const thenumber = items.length + 1
        return basic + thenumber
    } else {
        const thenumber = 1;
        return basic + thenumber
    }
}

async function insertOrderElement(data){
    const secondary = await read("Parts", {"type": data.shutterType})
    const itemID = await generateItem(data.customerID)
    updateOne("Orders", {"customerID": data.customerID, "submitted": "no"}, {
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

async function insertOrder(data){
    if (await counter(collection, {"customerID": data.customerID}) === 1) {
        if (await counter("Orders", {"customerID": data.customerID, "submitted": "no"}) === 0) {
            const secondary = await read("Parts", {"type": data.shutterType})
            const ID = await generate(data.customerID)
            const itemID = await generateItem(data.customerID)
            insert("Orders", {
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

async function submitOrder(data){
    if(await counter("Orders", {"customerID": data.customerID, "orderID": data.orderID, "submitted": "no"}) === 1){
        const where = {"customerID": data.customerID, "orderID": data.orderID}
        const submit = {$set: {"submitted": "submitted"}}
        updateOne("Orders", where, submit)
        logger.info("submitOrder request were found, and order is submitted!")
        return 'Order is submitted!'
    }
    else {
        logger.error("submitOrder request were found, but the order is already submitted!")
        throw 'This order is already submitted!'
    }
}

async function pay(data){
    const where = {"customerID": data.customerID, "orderID": data.orderID, "status": "readyToPay"}
    if(await counter("Orders", {"customerID": data.customerID, "orderID": data.orderID, "status": "readyToPay"})===1){
        updateOne("Receipts", {"customerID": data.customerID, "orderID": data.orderID}, {$set: {"payed": "payed"}})
        updateOne("Orders", where, {$set: {"payed": "payed", "status": "done"}})
        logger.info("pay request were found, order is payed!")
        return 'The order is payed!'
    }
    else {
        logger.error("pay request were found, but the order is not ready to pay!")
        throw 'This order is not ready to pay!'
    }
}

module.exports={
    "readAll": readAll,
    "readOrders": readOrders,
    "readreceipts": readReceipts,
    "insertCustomer": insertCustomer,
    "insertOrder": insertOrder,
    "submitOrder": submitOrder,
    "pay": pay
}
