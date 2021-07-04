const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const util = require("util");

const hcm = express();
hcm.use(bodyParser.json());

//Endpoint for GET /leave-data
//To retrieve Leave Data of an Employee
/**************************
  Query Format
  /employee/leave-data
***************************/
hcm.get("/leave-data", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-employee/leave-det",
    headers: {
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=yGvTTaeWlh1_i--O1V8C07a-_vc2egF-Y2kA_SAPh0gkn2s79bVWSkmre2vnLOHi; JSESSIONMARKID=dJNrvgq-vi91izVBaN_ukmQr-12Vlgb4Bnpn5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        const details = body.IT_LEAVE_DET.item,
          quota = body.IT_LEAVE_QUOTA.item,
          types = body.IT_LEAVE_TYPES.item;
        if (body.RETURN.TYPE === "S")
          res.status(200).send({ details, quota, types });
      } catch (error) {
        res.status(404).send({ message: "Records Not Found" });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      EMPL_ID: req.user.username,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for POST /leave-req
//To create Leave Request
/**************************
  req.body Format
  {
      "eid": "string",
      "start_date": "string",
      "end_date": "string",
      "type": "string",
  }
***************************/
hcm.post("/leave-req", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-employee/leave-req",
    headers: {
      Authorization: "Basic UE9VU0VSOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=Ct76tWQzHyHm2RprCjYQ60Hd3qpwegF-Y2kA_SAP81Q6x8tzN4QMzFt4IGBgb1m-; JSESSIONMARKID=bbp9OwUaaOwBKXNopMdPXiuH5u7mzSvyzRFn5jaQA; saplb_*=(J2EE6906720)6906750",
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
      if (body.RETURN?.TYPE === "E") {
        console.error(body.RETURN?.MESSAGE);
        res.status(501).send({ error: body.RETURN?.MESSAGE });
      } else res.status(201).send({ message: "Leave Request Created." });
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      EMPL_ID: req.body.eid,
      START_DATE: req.body.start_date,
      END_DATE: req.body.end_date,
      LEAVE_TYPE: req.body.type,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /ps
//To retrieve Pay Slip List of an Employee
/**************************
  Query Format
  /employee/ps
***************************/
hcm.get("/ps", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-employee/ps-list",
    headers: {
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=yGvTTaeWlh1_i--O1V8C07a-_vc2egF-Y2kA_SAPh0gkn2s79bVWSkmre2vnLOHi; JSESSIONMARKID=dJNrvgq-vi91izVBaN_ukmQr-12Vlgb4Bnpn5jaQA; saplb_*=(J2EE6906720)6906750",
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
      if (body.LIST === "")
        res.status(404).send({ message: "Records Not Found" });
      else res.status(200).send(body.LIST.item);
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      EMPL_ID: req.user.username,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /ps-details
//To retrieve Pay Slip Details (as PDF/HTML) of a Sequence Number
/**************************
    Query Format
    /vendor/ps-details?sn={seq_no}
***************************/
hcm.get("/ps-details", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-employee/ps-det",
    headers: {
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=yGvTTaeWlh1_i--O1V8C07a-_vc2egF-Y2kA_SAPh0gkn2s79bVWSkmre2vnLOHi; JSESSIONMARKID=dJNrvgq-vi91izVBaN_ukmQr-12Vlgb4Bnpn5jaQA; saplb_*=(J2EE6906720)6906750",
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
      if (body.RETURN_HTML?.TYPE === "E" || body.RETURN_PDF?.TYPE === "E")
        res.status(404).send({
          message: "Record Not Found",
        });
      else {
        const pdf = body.BASE64_PDF;
        const html = body.HTML;
        res.status(200).send({ pdf, html });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      EMPL_ID: req.user.username,
      SEQ_NO: req.query.sn,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for PUT /notice
//To Maintain the Notice Period Table
/**************************
req.body Format
  {
    "option": "status" | "request" | "cancel" | "approve" | "decline",
  }
***************************/
hcm.put("/notice", (req, res) => {
  const { option } = req.body;
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-employee/notice",
    headers: {
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=yGvTTaeWlh1_i--O1V8C07a-_vc2egF-Y2kA_SAPh0gkn2s79bVWSkmre2vnLOHi; JSESSIONMARKID=dJNrvgq-vi91izVBaN_ukmQr-12Vlgb4Bnpn5jaQA; saplb_*=(J2EE6906720)6906750",
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
      if (body.STATUS) res.status(200).send({ message: body.STATUS });
      else res.status(200).send({ message: body.RETURN.MESSAGE });
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      EMPL_ID: req.user.username,
      OPTION: option.toUpperCase(),
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /final-set
//To retrieve the Final Settlement of an Employee
/**************************
  Query Format
  /employee/final-set
***************************/
hcm.get("/final-set", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-employee/final-settlement",
    headers: {
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=yGvTTaeWlh1_i--O1V8C07a-_vc2egF-Y2kA_SAPh0gkn2s79bVWSkmre2vnLOHi; JSESSIONMARKID=dJNrvgq-vi91izVBaN_ukmQr-12Vlgb4Bnpn5jaQA; saplb_*=(J2EE6906720)6906750",
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
      res.status(200).send(body);
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      EMPL_ID: req.user.username,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

module.exports = hcm;
