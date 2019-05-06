var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const CustomerController = require('./Customer/ShutterCustomerController');

app.use('/customer', CustomerController);

app.listen(8080, () => {
    console.log('Server is listening on 8080!');
});
