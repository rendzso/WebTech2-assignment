process.env.NODE_ENV = 'test';

const assert = require('assert');
const sinon = require('sinon');
const mocha = require('mocha');

const service = require(`../Customer/ShutterCustomerService`);

let dao = {

    readWithData: async function(placeholder, customerID){
      return(customerID);
    }

};

const daoMock = sinon.mock(dao);
const customerService = new service(dao);

describe('Customer Service test', function () {
    it('without customerID should return undefined', async function () {
        const result = await customerService.readAll();
        assert.strictEqual(result.customerID, undefined);

    })
    it('with customerID should return with the id', async function () {
        const result = await customerService.readAll("domcsa");
        assert.strictEqual(result.customerID, "domcsa");

    })
    it('readall called once', async function () {
        let spy = sinon.spy(customerService, 'readAll')
        await customerService.readAll("domcsa");
        assert.strictEqual(spy.calledOnce, true)

    })
    it('from true dao it should return whit a json, full of data', async function () {
        let actual = new service()
        const result = await actual.readAll("domcsa");
        assert.strictEqual(result[0].customerID, "domcsa");
        assert.strictEqual(result[0].name, "Kovács Dominik Csaba");
        assert.strictEqual(result[0].phone, "06-30-347-4892");
        assert.strictEqual(result[0].place, "2045 Siófok, Petőfi Sándor út 168.");
    })

})
