var express = require('express')
var router = express.Router()
var srs = require('./ShutterCustomerService')

router.get('/list', async (req, res) => {
    if (req.query.customerID === undefined || req.query.customerID === '') {
        res.status(414).send('CustomerID is missing!');
        return;
    }
    res.status(200).send(await srs.readAll(req.query.customerID))
})

router.get('/listCustomer', async (req, res) => {
    if (req.query.customerID === undefined || req.query.customerID === '') {
        res.status(414).send('CustomerID is missing!');
        return;
    }
    res.status(200).send(await srs.readCustomerOrders(req.query.customerID))
})

router.get('/listReceipts', async (req, res) => {
    if (req.query.customerID === undefined || req.query.customerID === '') {
        res.status(414).send('CustomerID is missing!');
        return;
    }
    res.status(200).send(await srs.readCustomerReceipts(req.query.customerID))
})

router.post('/addCustomer', async (req, res) => {
    if (req.body.customerID === '') {
        res.status(414).send('CustomerID missing!');
        return;
    }
    if (req.body.name === '') {
        res.status(414).send('Customer name is missing!');
        return;
    }
    if (req.body.phone === '') {
        res.status(414).send('Phone number is missing!');
        return;
    }
    if (req.body.place === '') {
        res.status(414).send('Place is missing!');
        return;
    }
    try {
        res.status(200).send(await srs.addCustomer(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/addOrder', async (req, res) => {
    if (req.body.customerID === '') {
        res.status(414).send('CustomerID missing!');
        return;
    }
    if (req.body.windowHeight === '') {
        res.status(414).send('Window height is missing!');
        return;
    }
    if (req.body.windowWidth === '') {
        res.status(414).send('window width is missing!');
        return;
    }
    if (req.body.shutterType === '') {
        res.status(414).send('Shutter type missing!');
        return;
    }
    if (req.body.shutterColor === '') {
        res.status(414).send('Shutter color missing!');
        return;
    }
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
