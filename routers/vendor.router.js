const express = require("express");
const router = express.Router();
const http = require("http");

router.use((req, res, next) => {
  if (req.user.role === "vendor") next();
  else return res.status(401).send({ message: "Unauthorized" });
});

router.get("/", function (req, res) {
  res.send(`Vendor Router Working with user ${req.user.username}`);
});

//Endpoint for GET /profile
//To get Vendor Details
/**************************
  Query Format
  /vendor/profile
***************************/
router.get("/profile", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/profile",
    headers: {
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=Qt2Ua3KUyVUoO2fc26IFx3mx4DDBeQF-Y2kA_SAPPl9gpn1s60U3Q7_XgvN8QDmq; JSESSIONMARKID=_6-0qQqHtbf26kCKPZOTL5n6XY6JKQktTLtn5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (resp) => {
    const chunks = [];

    resp.on("data", (chunk) => {
      chunks.push(chunk);
    });

    resp.on("end", (chunk) => {
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const profile = {
        vid: body.VEND_DET.VENDOR,
        name1: body.VEND_DET.NAME,
        name2: body.VEND_DET.NAME_2,
        city: body.VEND_DET.CITY,
        region: body.VEND_DET.REGION,
        district: body.VEND_DET.DISTRICT,
        street: body.VEND_DET.STREET,
        pcode: body.VEND_DET.POSTL_CODE,
        country: body.VEND_DET.COUNTRY,
        lang: body.VEND_DET.LANGU,
      };
      res.send({ ...profile });
    });

    resp.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      VEND_ID: req.user.username,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for PUT /profile
//To update Vendor Details
/**************************
  req.body Format
  {
    "vid": "string",
    "name1": "string",
    "name2": "string",
    "city": "string",
    "region": "string",
    "district": "string",
    "street": "string",
    "p_code": "string",
    "country": "string",
    "lang": "string"
  }
  All keys are optional
***************************/
router.put("/profile", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/edit-profile",
    headers: {
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=Qt2Ua3KUyVUoO2fc26IFx3mx4DDBeQF-Y2kA_SAPPl9gpn1s60U3Q7_XgvN8QDmq; JSESSIONMARKID=_6-0qQqHtbf26kCKPZOTL5n6XY6JKQktTLtn5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      const body = JSON.parse(Buffer.concat(chunks).toString());
      switch (body.RETURN.MESSAGE) {
        case "SUCCESS":
          return res.status(200).send({
            message: `Profile Updated`,
          });
        case "ERROR_IN_SELECTION":
          return res.status(404).send({
            message: `Not Found`,
          });
        default:
          return res.status(501).send({
            message: `Error in Updation`,
          });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      VEND_DET: {
        VENDOR: req.body.vid,
        NAME: req.body.name1,
        NAME_2: req.body.name2,
        CITY: req.body.city,
        DISTRICT: req.body.region,
        POSTL_CODE: req.body.district,
        REGION: req.body.street,
        STREET: req.body.p_code,
        COUNTRY: req.body.country,
        LANGU: req.body.lang,
      },
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

router.use(require("../vendor/fi.route"));
router.use(require("../vendor/mm.route"));

module.exports = router;
