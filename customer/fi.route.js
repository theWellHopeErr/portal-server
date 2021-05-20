const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const parseString = require("xml2js").parseString;
const util = require("util");
const { flattenJSON, flattenJSONArray } = require("../helpers");

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
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTCREDIT&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIwMTczMAUABAAAAAgKAAZQT1VTRVL%2FAQYwggECBgkqhkiG9w0BBwKggfQwgfECAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGB0TCBzgIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIwMTczMDM5WjAjBgkqhkiG9w0BCQQxFgQUeL4wA4IcSM%2FCkvj31YWTsmF6BkcwCQYHKoZIzjgEAwQwMC4CFQCsAlc70153%2FdOf%2FYg8Wsd6bNbGTgIVAK7hvOHX1CWNPRPjLL5OOsYbDyEj; JSESSIONID=jJIdxROBhAShOyXZIkZUAUjsTNSKeQF-Y2kA_SAPD-x6jZH6lRAN6sv5zkc-QqkY; JSESSIONMARKID=TDt_YAZ-8o3AvLbUcrn8IyjQ6vXNlbUtjDY35jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      const body = Buffer.concat(chunks);
      parseString(body, (err, result) => {
        try {
          if (result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"]) {
            console.error({
              message:
                result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"][0][
                  "faultstring"
                ][0],
            });
            return res
              .status(501)
              .send({ message: "Something's wrong with SAP" });
          } else {
            if (
              result["SOAP:Envelope"]["SOAP:Body"][0][
                "ns0:ZBAPI_SSR_CUSTCREDIT.Response"
              ][0]["RETURN"][0]["TYPE"][0] === "E"
            ) {
              return res.status(404).send({ message: "Records Not Found!!" });
            } else {
              response =
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTCREDIT.Response"
                ][0]["MEMO"][0]["item"];
              flattenJSONArray(response);
              return res.status(200).send(response);
            }
          }
        } catch (error) {
          console.error(error);
          return res.status(500).send({ message: "Internal Server Error" });
        }
      });
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    request.write(
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTCREDIT>\r\n         <CUST_ID>${req.user.username}</CUST_ID>\r\n      </urn:ZBAPI_SSR_CUSTCREDIT>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
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
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTDEBIT&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIwMTczMAUABAAAAAgKAAZQT1VTRVL%2FAQYwggECBgkqhkiG9w0BBwKggfQwgfECAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGB0TCBzgIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIwMTczMDM5WjAjBgkqhkiG9w0BCQQxFgQUeL4wA4IcSM%2FCkvj31YWTsmF6BkcwCQYHKoZIzjgEAwQwMC4CFQCsAlc70153%2FdOf%2FYg8Wsd6bNbGTgIVAK7hvOHX1CWNPRPjLL5OOsYbDyEj; JSESSIONID=btQAXsO-X2dPWyXJ3qlVj_U9suOKeQF-Y2kA_SAPY-lSi1Tl7_6jKdwxjuvCP62B; JSESSIONMARKID=1XpyRwo4kHD7WdLAytpMEGPMTjIYVUC8SuZH5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      const body = Buffer.concat(chunks);
      parseString(body, (err, result) => {
        try {
          if (result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"]) {
            console.error({
              message:
                result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"][0][
                  "faultstring"
                ][0],
            });
            return res
              .status(501)
              .send({ message: "Something's wrong with SAP" });
          } else {
            if (
              result["SOAP:Envelope"]["SOAP:Body"][0][
                "ns0:ZBAPI_SSR_CUSTDEBIT.Response"
              ][0]["RETURN"][0]["TYPE"][0] === "E"
            ) {
              return res.status(404).send({ message: "Records Not Found!!" });
            } else {
              response =
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTDEBIT.Response"
                ][0]["MEMO"][0]["item"];
              flattenJSONArray(response);
              return res.status(200).send(response);
            }
          }
        } catch (error) {
          console.error(error);
          return res.status(500).send({ message: "Internal Server Error" });
        }
      });
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    request.write(
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTDEBIT>\r\n         <CUST_ID>${req.user.username}</CUST_ID>\r\n      </urn:ZBAPI_SSR_CUSTDEBIT>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
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
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTPA&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIwMTczMAUABAAAAAgKAAZQT1VTRVL%2FAQYwggECBgkqhkiG9w0BBwKggfQwgfECAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGB0TCBzgIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIwMTczMDM5WjAjBgkqhkiG9w0BCQQxFgQUeL4wA4IcSM%2FCkvj31YWTsmF6BkcwCQYHKoZIzjgEAwQwMC4CFQCsAlc70153%2FdOf%2FYg8Wsd6bNbGTgIVAK7hvOHX1CWNPRPjLL5OOsYbDyEj; JSESSIONID=btQAXsO-X2dPWyXJ3qlVj_U9suOKeQF-Y2kA_SAPY-lSi1Tl7_6jKdwxjuvCP62B; JSESSIONMARKID=1XpyRwo4kHD7WdLAytpMEGPMTjIYVUC8SuZH5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (resp) => {
    const chunks = [];

    resp.on("data", (chunk) => {
      chunks.push(chunk);
    });

    resp.on("end", (chunk) => {
      const body = Buffer.concat(chunks);
      parseString(body, (err, result) => {
        try {
          if (result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"]) {
            console.error({
              message:
                result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"][0][
                  "faultstring"
                ][0],
            });
            return res
              .status(501)
              .send({ message: "Something's wrong with SAP" });
          } else {
            if (
              result["SOAP:Envelope"]["SOAP:Body"][0][
                "ns0:ZBAPI_SSR_CUSTPA.Response"
              ][0]["RETURN"][0] &&
              result["SOAP:Envelope"]["SOAP:Body"][0][
                "ns0:ZBAPI_SSR_CUSTPA.Response"
              ][0]["RETURN"][0]["TYPE"][0] !== "S"
            ) {
              console.error({
                message: "Records Not Found",
              });
              return res.status(404).send({
                message: "Records Not Found",
              });
            } else {
              let response;
              if (
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTPA.Response"
                ][0]["IT_RES"][0]["item"]
              )
                response =
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTPA.Response"
                  ][0]["IT_RES"][0]["item"];
              flattenJSONArray(response);

              return res.status(200).send(response);
            }
          }
        } catch (error) {
          console.error(error);
          return res.status(500).send({ message: "Internal Server Error" });
        }
      });
    });

    resp.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    request.write(
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTPA>\r\n         <CUST_ID>${req.user.username}</CUST_ID>\r\n      </urn:ZBAPI_SSR_CUSTPA>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

module.exports = fi;
