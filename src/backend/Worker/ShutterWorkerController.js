var express = require('express')
var router = express.Router()
var srs = require('./ShutterWorkerService')
const workerService = new srs();

router.get('/list', async (req, res) => {
    res.status(200).send(await workerService.readOrders("none", "success"))
})

router.get('/listOwn', async (req, res) => {
    if (req.query.worker === '') {
        res.status(414).send('Worker ID missing!');
        return;
    }
    res.status(200).send(await workerService.readOrders(req.query.worker, "placeholder"))
})

router.post('/select', async (req, res) => {
    if (req.query.worker === '') {
        res.status(414).send('Worker ID missing!');
        return;
    }
    try {
        res.status(200).send(await workerService.selectOrder(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/success', async (req, res) => {
    if (req.query.worker === '') {
        res.status(414).send('Worker ID missing!');
        return;
    }
    try {
        res.status(200).send(await workerService.successOrder(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router;
