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

router.post('/addWindows', async (req, res) => {
    res.status(200).send(await srs.addWindow(req.body))
})

router.post('/addShutter', async (req, res) => {
    res.status(200).send(await srs.addShutter(req.body))
})

router.post('/submitOrder', async (req, res) => {
    res.status(200).send(await srs.submitOrder(req.body))
})

module.exports = router;
