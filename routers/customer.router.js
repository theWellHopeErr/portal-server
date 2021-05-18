const express = require("express");
const router = express.Router();
const http = require("http");
const xml2js = require("xml2js");
const parseString = require("xml2js").parseString;
const util = require("util");

router.use((req, res, next) => {
  if (req.user.role === "customer") next();
  else return res.status(401).send({ message: "Unauthorized" });
});

//Endpoint for GETT /
//To make sure Customer Routing is Working
router.get("/", (req, res) => {
  res.send("Customer Router Working");
});

//Endpoint for GET /profile
//To get Customer Details
/**************************
  Query Format
  /customer/profile?cust_id={customer-id}
***************************/
router.get("/profile", (req, res) => {
  var options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTDET&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTE2MDkyMwUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTE2MDkyMzU2WjAjBgkqhkiG9w0BCQQxFgQU5r6O2bvFhM0vnhUjBZEXQaBRd4UwCQYHKoZIzjgEAwQuMCwCFEvw46iRGiRTdWal0lGENdkvIh7mAhR99nbBV%2FVuF!vWcFf9TJwBOHeU1A%3D%3D; JSESSIONID=DlxfTFaU-oEiQ-KaDS665MR_Q310eQF-Y2kA_SAPd8qUzL0O7vhfvOohPvMQHDLa; JSESSIONMARKID=DSoJ_QN8PWUmulnak1smvazX7Igwnu0VbmDn5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  var request = http.request(options, (resp) => {
    var chunks = [];

    resp.on("data", (chunk) => {
      chunks.push(chunk);
    });

    resp.on("end", (chunk) => {
      var body = Buffer.concat(chunks);
      parseString(body, (err, result) => {
        try {
          if (result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"]) {
            console.log(
              result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"][0][
                "faultstring"
              ][0]
            );
            res.status(501).send({ message: "Something's wrong with SAP" });
          } else {
            const {
              CUSTOMER,
              NAME,
              NAME_2,
              CITY,
              REGION,
              DISTRICT,
              STREET,
              POSTL_CODE,
              COUNTRY,
              TELEPHONE,
            } =
              result["SOAP:Envelope"]["SOAP:Body"][0][
                "ns0:ZBAPI_SSR_CUSTDET.Response"
              ][0]["CUST_DET"][0];
            const body = {
              cid: CUSTOMER[0],
              name1: NAME[0],
              name2: NAME_2[0],
              city: CITY[0],
              region: REGION[0],
              district: DISTRICT[0],
              street: STREET[0],
              pcode: POSTL_CODE[0],
              country: COUNTRY[0],
              tel: TELEPHONE[0],
            };
            res.send({ ...body });
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Internal Server Error" });
        }
      });
    });

    resp.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    request.write(
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTDET>\r\n         <CUST_ID>${req.query.cust_id}</CUST_ID>\r\n      </urn:ZBAPI_SSR_CUSTDET>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for PUT /profile
//To update Customer Details
/**************************
  req.body Format
  {
    "customer": "string",
    "name": "string",
    "name_2": "string",
    "city": "string",
    "region": "string",
    "district": "string",
    "street": "string",
    "postal_code": "string",
    "country": "string",
    "telephone": "string"
  }
  All keys are optional
***************************/
router.put("/profile", (req, res) => {
  var options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTDETUPD&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTE2MDkyMwUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTE2MDkyMzU2WjAjBgkqhkiG9w0BCQQxFgQU5r6O2bvFhM0vnhUjBZEXQaBRd4UwCQYHKoZIzjgEAwQuMCwCFEvw46iRGiRTdWal0lGENdkvIh7mAhR99nbBV%2FVuF!vWcFf9TJwBOHeU1A%3D%3D; JSESSIONID=DlxfTFaU-oEiQ-KaDS665MR_Q310eQF-Y2kA_SAPd8qUzL0O7vhfvOohPvMQHDLa; JSESSIONMARKID=AtVP_whRp69jqa6zmZb9dQa1aOGOxKoNo2Fn5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  var request = http.request(options, (response) => {
    var chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      var body = Buffer.concat(chunks);
      parseString(body, (err, result) => {
        try {
          if (result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"]) {
            console.log(
              result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"][0][
                "faultstring"
              ][0]
            );
            res.status(501).send({ message: "Something's wrong with SAP" });
          } else {
            if (
              result["SOAP:Envelope"]["SOAP:Body"][0][
                "ns0:ZBAPI_SSR_CUSTDETUPD.Response"
              ]
            ) {
              switch (
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTDETUPD.Response"
                ][0]["RETURN"][0]
              ) {
                case "SUCCESS":
                  res.status(200).send({
                    message: `Profile Updated`,
                  });
                  break;
                case "ERROR_IN_SELECTION":
                  res.status(404).send({
                    message: `Not Found`,
                  });
                  break;
                default:
                  res.status(501).send({
                    message: `Error in Updation`,
                  });
                  break;
              }
            } else {
              res.status(501).send({
                message: `Error in Updation`,
              });
              return;
            }
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Internal Server Error" });
        }
      });
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });
  var builder = new xml2js.Builder();
  const cust_det = {
    CUST_DET: {
      CUSTOMER: req.body.cid,
      NAME: req.body.name1,
      NAME_2: req.body.name2,
      CITY: req.body.city,
      REGION: req.body.region,
      DISTRICT: req.body.district,
      STREET: req.body.street,
      POSTL_CODE: req.body.pcode,
      COUNTRY: req.body.country,
      TELEPHONE: req.body.tel,
    },
  };
  console.log(req.body);
  try {
    const cust_det_xml = builder.buildObject(cust_det).slice(56);
    request.write(
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTDETUPD>
    ${cust_det_xml}
    </urn:ZBAPI_SSR_CUSTDETUPD>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    res.status(501).send({ message: "Something's wrong" });
  }
});

router.use(require("../customer/fi.route"));
router.use(require("../customer/sd.route"));

module.exports = router;
