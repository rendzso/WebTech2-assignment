var express = require('express')
var router = express.Router()
var srs = require('./ShutterWorkerService')

router.get('/list', async (req, res) => {
    res.status(200).send(await srs.readReady())
})

router.post('/select', async (req, res) => {
    res.status(200).send(await srs.selectOrder(req.body))
})

router.post('/success', async (req, res) => {
    res.status(200).send(await srs.successOrder(req.body))
})

module.exports = router;
