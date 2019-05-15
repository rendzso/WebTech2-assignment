var express = require('express')
var router = express.Router()
var srs = require('../service/ShutterManagerService')
const managerService = new srs();

router.get('/list', async (req, res) => {
    res.status(200).send(await managerService.readAll())
})

router.get('/listToReceipt', async (req, res) => {
    res.status(200).send(await managerService.readReadyToReceipt())
})

router.get('/listToOrganize', async (req, res) => {
    res.status(200).send(await managerService.readReadyToOrganize())
})

router.post('/organize', async (req, res) => {
    if (req.body.date === '') {
        res.status(414).send('Date is missing!');
        return;
    }
    try {
        res.status(200).send(await managerService.organizeInstallation(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/createReceipt', async (req, res) => {
    try {
        res.status(200).send(await managerService.createReceipt(req.body))
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/statistic', async (req, res) => {
    res.status(200).send(await managerService.getCustomerWithMoney())
})

module.exports = router;
