const express = require("express");
const bodyParser = require('body-parser');

const customerRoute = express();
customerRoute.use(bodyParser.json());

customerRoute.get('/',(req,res)=>{
    res.send('hello, there!')
})
