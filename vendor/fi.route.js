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
      VEND_ID: req.user.username,
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
      VEND_ID: req.user.username,
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

//Endpoint for GET /invoice
//To retrieve Invoice List of a Vendor
/**************************
  Query Format
  /vendor/invoice
***************************/
fi.get("/invoice", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/inv-list",
    headers: {
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNjEzMDgzMwUABAAAAAgKAAZQT1VTRVL%2FAQUwggEBBgkqhkiG9w0BBwKggfMwgfACAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGB0DCBzQIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNjEzMDgzMzQ3WjAjBgkqhkiG9w0BCQQxFgQU3cQAwhaDgQF5nAoWLOSwcXXBy!gwCQYHKoZIzjgEAwQvMC0CFBxoDFEBaspwsK646A9R!H!lY8EUAhUAsKMT5ddwclCfFH9kf9BMAcYP370%3D; JSESSIONID=-hGXSgfAcwGT0ReL_r1z-FKLEEYEegF-Y2kA_SAPKducDoz54JMnbMerMDh75YKl; JSESSIONMARKID=XTCLaAzEozDrHghuAUAvHR_8BJEJHB6LuFrX5jaQA; saplb_*=(J2EE6906720)6906750",
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
      if (body.HEADER === "")
        res.status(404).send({ message: "Records Not Found" });
      else res.status(200).send(body.HEADER.item);
    });

    response.on("error", (error) => {
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

//Endpoint for GET /invoice-pdf
//To retrieve Invoice as a Smart Adobe Form
/**************************
  Query Format
  /vendor/invoice-pdf?inv_no={invoice_no}&year={fiscal_year}
***************************/
fi.get("/invoice-pdf", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/inv-pdf",
    headers: {
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNjEzMDgzMwUABAAAAAgKAAZQT1VTRVL%2FAQUwggEBBgkqhkiG9w0BBwKggfMwgfACAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGB0DCBzQIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNjEzMDgzMzQ3WjAjBgkqhkiG9w0BCQQxFgQU3cQAwhaDgQF5nAoWLOSwcXXBy!gwCQYHKoZIzjgEAwQvMC0CFBxoDFEBaspwsK646A9R!H!lY8EUAhUAsKMT5ddwclCfFH9kf9BMAcYP370%3D; JSESSIONID=-hGXSgfAcwGT0ReL_r1z-FKLEEYEegF-Y2kA_SAPKducDoz54JMnbMerMDh75YKl; JSESSIONMARKID=XTCLaAzEozDrHghuAUAvHR_8BJEJHB6LuFrX5jaQA; saplb_*=(J2EE6906720)6906750",
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
      if (body.BASE64_PDF === "")
        res.status(404).send({ message: "Records Not Found" });
      else res.status(200).send({ pdf: body.BASE64_PDF });
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      P_VENDOR: req.user.username,
      P_INVNO: req.query.inv_no,
      P_FISC: req.query.year,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

module.exports = fi;
