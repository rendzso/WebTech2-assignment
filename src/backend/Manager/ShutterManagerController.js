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

router.post('/organize', async (req, res) => {
    try {
        res.status(200).send(await srs.setDeliveryTime(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/createReceipt', async (req, res) => {
    try {
        res.status(200).send(await srs.createReceipt(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router;
