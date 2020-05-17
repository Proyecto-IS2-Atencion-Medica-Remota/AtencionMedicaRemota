const express = require('express');
const app = express();
const msql = require("mysql");
const cors = require('cors');

const bodyParser = require('body-parser')


const _ = require('lodash');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

    // config for your database

const con = msql.createConnection({

        user: 'root',
        password: 'admin',
        server: 'LAPTOP-AKALA047',
        database: 'monitoreo',
        insecureAuth : true
    });




con.connect(function (err) {

        if (err) console.log(err);
        console.log("Connected!");
       });

       
       app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    });
  


app.use(bodyParser.json());














app.get('/pacientes', (req, res) => {
    console.log("holaaaaaaaaaaa")
       const select_query=`SELECT * 
       FROM pacientes;`
    con.query(select_query, (err, result) => {
        console.log(result);
        if (err){
          	return res.send(err)
       	}else{
           	return res.json({

                   data: result

           	})
        }
   	});
});






var server = app.listen(8000, function () {
    console.log('Server is running..');
});
