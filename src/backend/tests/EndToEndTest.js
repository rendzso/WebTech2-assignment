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
            .get('/customer/list')
            .end((err, res) => {
                res.should.have.status(414);
                done();
            })
    })
    it('should return status code 200, if req.query has a proper data', (done) => {
        chai.request(server)
            .get('/customer/list?customerID=domcsa')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
    it('res.send should be 1 item', (done) => {
        chai.request(server)
            .get('/customer/list?customerID=domcsa')
            .end((err, res) => {
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done()
            })
    })
    it('res.send should be equal docmsas data', (done) => {
        chai.request(server)
            .get('/customer/list?customerID=domcsa')
            .end((err, res) => {
                var checkObj = {
                    _id: '5cd82fbf70200f0a259e4b12',
                    customerID: 'domcsa',
                    name: 'Kovács Dominik Csaba',
                    phone: '06-30-347-4892',
                    place: '2045 Siófok, Petőfi Sándor út 168.'
                }
                res.body[0].should.be.deep.equal(checkObj);
                done()
            })
    })
})
