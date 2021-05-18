const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const util = require("util");

const sd = express();
sd.use(bodyParser.json());

//Endpoint for GET /inquiry
//To retrieve Inquiry List of a Customer
/**************************
  Query Format
  /customer/inquiry
***************************/
sd.get("/inquiry", (req, res) => {
  console.log(req.user);
  var options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTINQLIST&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTE4MTMzNwUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTE4MTMzNzU3WjAjBgkqhkiG9w0BCQQxFgQUyVCbRVvUXuRQYIk8mkyFwBy!fb4wCQYHKoZIzjgEAwQuMCwCFAjsn0bKM9ygXeQuKOmYf7BgsdCkAhQc%2Fk2ALDyJOp7cSbw0DxtrN8mIEA%3D%3D; JSESSIONID=OqDUbRh88-OqNPNVflKNqI7tiLJ_eQF-Y2kA_SAP7HZdCfpEzypgLH4ZNCoCP7tZ; JSESSIONMARKID=a6prUg7CTcRDiMqIXDn6ZPXO98pEijHSedun5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  var request = http.request(options, function (resp) {
    var chunks = [];

    resp.on("data", function (chunk) {
      chunks.push(chunk);
    });

    resp.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      parseString(body, (err, result) => {
        console.log(util.inspect(result, { showHidden: true, depth: null }));
        try {
          if (result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"]) {
            console.log(
              result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"][0][
                "faultstring"
              ][0]
            );
            res.status(501).send({ message: "Something's wrong with SAP" });
          } else {
            // TODO: Handle the list and send in response
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Internal Server Error" });
        }
      });
    });

    resp.on("error", function (error) {
      console.error(error);
    });
  });

  try {
    request.write(
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTINQLIST>\r\n         <!--You may enter the following 2 items in any order-->\r\n         <CID>${req.user.username}</CID>\r\n         <!--Optional:-->\r\n         <IT_VBAK>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n               <!--Optional:-->\r\n               <VBELN>?</VBELN>\r\n               <!--Optional:-->\r\n               <VBTYP>?</VBTYP>\r\n               <!--Optional:-->\r\n               <KUNNR>?</KUNNR>\r\n            </item>\r\n         </IT_VBAK>\r\n      </urn:ZBAPI_SSR_CUSTINQLIST>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /inquiry-details
//To retrieve Inquiry Details of a salesdocument
/**************************
  Query Format
  /customer/inquiry-details?sd={salesdocument}
***************************/
sd.get("/inquiry-details", (req, res) => {
  console.log(req.query.sd);
});

//Endpoint for GET /so
//To retrieve Sales Order List of a Customer
/**************************
  Query Format
  /customer/so
***************************/
sd.get("/so", (req, res) => {
  console.log(req.user);
  var options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTSOLIST&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTE4MTMzNwUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTE4MTMzNzU3WjAjBgkqhkiG9w0BCQQxFgQUyVCbRVvUXuRQYIk8mkyFwBy!fb4wCQYHKoZIzjgEAwQuMCwCFAjsn0bKM9ygXeQuKOmYf7BgsdCkAhQc%2Fk2ALDyJOp7cSbw0DxtrN8mIEA%3D%3D; JSESSIONID=OqDUbRh88-OqNPNVflKNqI7tiLJ_eQF-Y2kA_SAP7HZdCfpEzypgLH4ZNCoCP7tZ; JSESSIONMARKID=V7CZ8QWGCOw2WCgNp15-vruHRu_lIhbt_nuX5jaQA; saplb_*=(J2EE6906720)6906750",
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
        console.log(util.inspect(result, { showHidden: true, depth: null }));
        try {
          if (result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"]) {
            console.log(
              result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"][0][
                "faultstring"
              ][0]
            );
            res.status(501).send({ message: "Something's wrong with SAP" });
          } else {
            // TODO: Handle the list and send in response
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
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTSOLIST>\r\n         <!--You may enter the following 2 items in any order-->\r\n         <CID>${req.user.username}</CID>\r\n         <!--Optional:-->\r\n         <IT_VBAK>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n               <!--Optional:-->\r\n               <VBELN>?</VBELN>\r\n               <!--Optional:-->\r\n               <VBTYP>?</VBTYP>\r\n               <!--Optional:-->\r\n               <KUNNR>?</KUNNR>\r\n            </item>\r\n         </IT_VBAK>\r\n      </urn:ZBAPI_SSR_CUSTSOLIST>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /so-details
//To retrieve Sales Order Details of a salesdocument
/**************************
  Query Format
  /customer/so-details?sd={salesdocument}
***************************/
sd.get("/so-details", (req, res) => {
  console.log(req.query.sd);
});

module.exports = sd;
