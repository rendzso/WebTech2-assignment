var express = require('express')
var router = express.Router()
var srs = require('./ShutterCustomerService')

router.get('/list', async (req, res) => {
    res.status(200).send(await srs.readAll())
})

router.get('/listUser', async (req, res) => {
    res.status(200).send(await srs.readUser(req.query.customerID))
})

module.exports = router;
