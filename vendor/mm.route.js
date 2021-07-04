const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const util = require("util");

const mm = express();
mm.use(bodyParser.json());

//Endpoint for GET /rfq
//To retrieve Request for Quotation List of a Vendor
/**************************
  Query Format
  /vendor/rfq
***************************/
mm.get("/rfq", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/rfq-list",
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
      if (body.RETURN.TYPE === "S") res.status(200).send(body.IT_EKKO.item);
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

//Endpoint for GET /rfq-details
//To retrieve Request for Quotation Details of a purchase document
/**************************
    Query Format
    /vendor/rfq-details?pd={purchase_document}
  ***************************/
mm.get("/rfq-details", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/rfq-det",
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
      if (body.RETURN?.item?.TYPE === "E")
        res.status(404).send({ message: "Records Not Found" });
      else {
        const items =
          body.ITEMS.item.length === undefined
            ? [body.ITEMS.item]
            : body.ITEMS.item;
        res.status(200).send(items);
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      PURCH_DOC: req.query.pd,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /po
//To retrieve Purchase Order List of a Vendor
/**************************
  Query Format
  /vendor/po
***************************/
mm.get("/po", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/po-list",
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
      if (body.RETURN.TYPE === "S") res.status(200).send(body.IT_EKKO.item);
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

//Endpoint for GET /po-details
//To retrieve Purchase Order Details of a purchase document
/**************************
  Query Format
  /vendor/po-details?pd={purchase_document}
***************************/
mm.get("/po-details", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/po-det",
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
      if (body.RETURN?.item?.TYPE === "E")
        res.status(404).send({ message: "Records Not Found" });
      else {
        const items =
          body.ITEMS.item.length === undefined
            ? [body.ITEMS.item]
            : body.ITEMS.item;
        const header = body.HEADER;
        res.status(200).send({ items, header });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      PURCH_DOC: req.query.pd,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for POST /po-create
//To create a Purchase Order
/**************************
  req.body Format
  {
      "vid": "string",
      "doc_date": "string",
      "comp_code": "string",
      "purch_org": "string",
      "purch_grp": "string",
      "del_date": "string",
      "material": "string",
      "short_txt": "string",
      "plant": "string",
      "quantity": "string",
      "po_item": "string",
  }
***************************/
mm.post("/po-create", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/po-create",
    headers: {
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
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
      if (body.RETURN?.item?.TYPE === "E") {
        console.error(body.RETURN?.item?.MESSAGE);
        res.status(501).send({ error: body.RETURN?.item?.MESSAGE });
      } else {
        if (body.PURCHASEORDER)
          res.status(201).send({ po: body.PURCHASEORDER });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      VEND_ID: req.body.vid,
      DOC_DATE: req.body.doc_date,
      COMPANY_CODE: req.body.comp_code,
      PURCHASE_ORG: req.body.purch_org,
      PURCHASE_GRP: req.body.purch_grp,
      DELIVERY_DATE: req.body.del_date,
      MATERIAL: req.body.material,
      SHORT_TEXT: req.body.short_txt,
      QUANTITY: req.body.plant,
      PLANT: req.body.quantity,
      PO_ITEM: req.body.po_item,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /gr
//To retrieve Goods Receipt List of a Vendor
/**************************
  Query Format
  /vendor/gr
***************************/
mm.get("/gr", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/gr-list",
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
      if (body.RETURN.TYPE === "S") res.status(200).send(body.IT_MSEG.item);
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

//Endpoint for GET /grg-details
//To retrieve Request for Quotation Details of a purchase document
/**************************
  Query Format
  /vendor/gr-details?md={material_document}&my={material_year}
***************************/
mm.get("/gr-details", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-vendor/gr-det",
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
      if (body.ITEMS === "")
        res.status(404).send({ message: "Records Not Found" });
      else {
        const items =
          body.ITEMS?.item?.length === undefined
            ? [body.ITEMS.item]
            : body.ITEMS.item;
        const header = body.HEADER;
        res.status(200).send({ items, header });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      MAT_DOC: req.query.md,
      MAT_YEAR: req.query.my,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

module.exports = mm;
