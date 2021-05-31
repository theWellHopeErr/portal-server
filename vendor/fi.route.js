const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const util = require("util");

const fi = express();
fi.use(bodyParser.json());

//Endpoint for GET /credit
//To get Credit Memo Details
/**************************
  Query Format
  /customer/credit
***************************/
fi.get("/credit", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/credit",
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

      if (body.RETURN.TYPE === "S") res.status(200).send(body.MEMO.item);
      else res.status(404).send({ message: "Records Not Found" });
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      VEND_ID: "10050",
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /debit
//To get Debit Memo Details
/**************************
  Query Format
  /customer/debit
***************************/
fi.get("/debit", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/debit",
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

      if (body.RETURN.TYPE === "S") res.status(200).send(body.MEMO.item);
      else res.status(404).send({ message: "Records Not Found" });
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      VEND_ID: "10050",
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /profile
//To get Payment and Aging Details
/**************************
  Query Format
  /customer/pa
***************************/
// fi.get("/pa", (req, res) => {
// });

fi.get("/pa", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/pa",
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
      if (body.IT_RES) res.status(200).send(body.IT_RES.item);
      else res.status(404).send({ message: "Records Not Found" });
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

module.exports = fi;
