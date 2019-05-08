var express = require('express')
var router = express.Router()
var srs = require('./ShutterCustomerService')

router.get('/list', async (req, res) => {
    res.status(200).send(await srs.readAll())
})

router.get('/listCustomer', async (req, res) => {
    res.status(200).send(await srs.readCustomerOrders(req.query.customerID))
})

router.post('/addCustomer', async (req, res) => {
    try {
        res.status(200).send(await srs.addCustomer(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/addOrder', async (req, res) => {
    try {
        res.status(200).send(await srs.addOrder(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
    })

router.post('/submitOrder', async (req, res) => {
    try {
        res.status(200).send(await srs.submitOrder(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/pay', async (req, res) => {
    try {
        res.status(200).send(await srs.pay(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router;
