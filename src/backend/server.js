var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const CustomerController = require('./Customer/ShutterCustomerController');
const WorkerController = require('./Worker/ShutterWorkerController');

app.use('/customer', CustomerController);

app.use('/worker', WorkerController);

app.listen(8080, () => {
    console.log('Server is listening on 8080!');
});
