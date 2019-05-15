var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const CustomerController = require('./controller/ShutterCustomerController');
const WorkerController = require('./controller/ShutterWorkerController');
const ManagerController = require('./controller/ShutterManagerController');

app.use('/customer', CustomerController);

app.use('/worker', WorkerController);

app.use('/manager', ManagerController)

app.listen(8081, () => {
    console.log('Server is listening on 8080!');
});

module.exports = app;
