var express = require('express')
var router = express.Router()
var srs = require('./ShutterCustomerService')

router.get('/list', async (req, res) => {
    res.status(200).send(await srs.readAll())
})

router.get('/listCustomer', async (req, res) => {
    res.status(200).send(await srs.readCustomer(req.query.customerID))
})

router.post('/addCustomer', async (req, res) => {
    res.status(200).send(await srs.addCustomer(req.body))
})

router.post('/addOrder', async (req, res) => {
    res.status(200).send(await srs.addOrder(req.body))
})

router.post('/submitOrder', async (req, res) => {
    res.status(200).send(await srs.submitOrder(req.body))
})

router.post('/pay', async (req, res) => {
    res.status(200).send(await srs.pay(req.body))
})

module.exports = router;
