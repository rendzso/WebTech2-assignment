var express = require('express')
var router = express.Router()
var srs = require('./ShutterCustomerService')

router.get('/list', async (req, res) => {
    res.status(200).send(await srs.readAll())
})

module.exports = router;
