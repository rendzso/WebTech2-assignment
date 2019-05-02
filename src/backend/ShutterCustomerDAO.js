const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'Shutter';
const collectionName = 'Customer';


function read(data) {
    return new Promise(async resolve => {
        const client = new MongoClient(url);
        await client.connect(() => {
            console.log('connected to db');
            var db = client.db(dbName);
            resolve(db.collection(collectionName).find(data).toArray());
            client.close();
        });
    });
}

module.exports = {
    "readAll" : read
}
