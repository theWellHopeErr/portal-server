const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const util = require("util");

const mm = express();
mm.use(bodyParser.json());

module.exports = mm;
