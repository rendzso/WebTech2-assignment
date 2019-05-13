process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);

describe('Customer, get customer data', ()=> {
    it('should return status code 414, if req.query empty', (done) => {
        chai.request(server)
            .get('/customer/listCustomer')
            .end((err, res) => {
                res.should.have.status(414);
                done();
            })
    })
    it('should return status code 200, if req.query has a proper data', (done) => {
        chai.request(server)
            .get('/customer/listCustomer?customerID=domcsa')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
    it('res.send should be 1 item', (done) => {
        chai.request(server)
            .get('/customer/listCustomer')
            .end((err, res) => {
                expect(res.send.calledOnce).to.be.true;
            })
    })
})
