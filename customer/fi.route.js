const express = require("express");
const bodyParser = require("body-parser");

const fi = express();
fi.use(bodyParser.json());

//Endpoint for GET /profile
//To get Customer Details
/**************************
  Query Format
  /customer/inquiry
***************************/
fi.get("/fi", (req, res) => {
  res.send("fi");
});

module.exports = fi;
