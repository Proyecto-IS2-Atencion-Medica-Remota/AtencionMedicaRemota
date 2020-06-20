const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const Pool = require('pg');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


const con = new Pool.Client("postgres://isw2020e:isw2020e@plop.inf.udec.cl:5432/");
con.connect();
app.use(bodyParser.json());



var server = app.listen(8000, function () {
    console.log('Server is running..');
});