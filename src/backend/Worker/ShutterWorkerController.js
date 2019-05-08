var express = require('express')
var router = express.Router()
var srs = require('./ShutterWorkerService')

router.get('/list', async (req, res) => {
    res.status(200).send(await srs.readReady("none", "success"))
})

router.get('/listOwn', async (req, res) => {
    res.status(200).send(await srs.readReady(req.query.worker, "placeholder"))
})

router.post('/select', async (req, res) => {
    try {
        res.status(200).send(await srs.selectOrder(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/success', async (req, res) => {
    try {
        res.status(200).send(await srs.successOrder(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router;
