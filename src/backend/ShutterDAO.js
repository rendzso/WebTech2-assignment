const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://172.21.0.10:27017';

const dbName = 'Shutter';


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

async function readWithData(collection, data){
    return (await read(collection, data))
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

module.exports = {
    "readAll" : read,
    "readWithData" : readWithData,
    "insert" : insert,
    "updateOne" : updateOne,
    "counter" : counter
}
