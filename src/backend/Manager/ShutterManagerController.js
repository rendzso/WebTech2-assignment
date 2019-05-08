var express = require('express')
var router = express.Router()
var srs = require('./ShutterManagerService')

router.get('/list', async (req, res) => {
    res.status(200).send(await srs.listAll())
})

router.get('/listToReceipt', async (req, res) => {
    res.status(200).send(await srs.listReadyToReceipt())
})

router.get('/listToOrganize', async (req, res) => {
    res.status(200).send(await srs.listReadyToOrganize())
})

router.post('/organize', (req, res) => {
    res.status(200).send(srs.setDeliveryTime(req.body))
})

router.post('/createReceipt', (req, res) => {
    res.status(200).send(srs.createReceipt(req.body))
})

module.exports = router;
