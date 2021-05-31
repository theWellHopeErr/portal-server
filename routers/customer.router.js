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
  res.send(`Customer Router Working with user ${req.user.username}`);
});

//Endpoint for GET /profile
//To get Customer Details
/**************************
  Query Format
  /customer/profile
***************************/
router.get("/profile", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTDET&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIwMDUzMQUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIwMDUzMTQ5WjAjBgkqhkiG9w0BCQQxFgQU0PzA74N6gRRQ1mQs!9Huca9JJ%2FwwCQYHKoZIzjgEAwQuMCwCFF50JW%2FmXmrfOfSZA5AEdtvn21P1AhQVfb5g!GY1zDT3EmF%2F3EgLLHQCUQ%3D%3D; JSESSIONID=ejz1-dHlQ3ftfg7yLgH-32ZuL0KIeQF-Y2kA_SAPpQ5dIe044JK3d_c4p73JE5rn; JSESSIONMARKID=lYCD1g0acW_c6QLK0lWz4iVMxRj2T_VD7nPH5jaQA; saplb_*=(J2EE6906720)6906750",
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
            console.error(
              result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"][0][
                "faultstring"
              ][0]
            );
            return res
              .status(501)
              .send({ message: "Something's wrong with SAP" });
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
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTDET>\r\n         <CUST_ID>${req.user.username}</CUST_ID>\r\n      </urn:ZBAPI_SSR_CUSTDET>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for PUT /profile
//To update Customer Details
/**************************
  req.body Format
  {
    "customer": "string",
    "name1": "string",
    "name2": "string",
    "city": "string",
    "region": "string",
    "district": "string",
    "street": "string",
    "p_code": "string",
    "country": "string",
    "tel": "string"
  }
  All keys are optional
***************************/
router.put("/profile", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTDETUPD&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIwMDUzMQUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIwMDUzMTQ5WjAjBgkqhkiG9w0BCQQxFgQU0PzA74N6gRRQ1mQs!9Huca9JJ%2FwwCQYHKoZIzjgEAwQuMCwCFF50JW%2FmXmrfOfSZA5AEdtvn21P1AhQVfb5g!GY1zDT3EmF%2F3EgLLHQCUQ%3D%3D; JSESSIONID=OzlYo4jEjIiR-n0RU3Rj_WAE3U2IeQF-Y2kA_SAPbf3GsYE5As4fUIrmCfj2Rtkh; JSESSIONMARKID=ZGOMbgyKO5kcyYv8BOHWVWi8cRn9bXTf87PX5jaQA; saplb_*=(J2EE6906720)6906750",
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
            console.error(
              result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"][0][
                "faultstring"
              ][0]
            );
            return res
              .status(501)
              .send({ message: "Something's wrong with SAP" });
          } else {
            if (
              result["SOAP:Envelope"]["SOAP:Body"][0][
                "ns0:ZBAPI_SSR_CUSTDETUPD.Response"
              ]
            ) {
              switch (
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTDETUPD.Response"
                ][0]["RETURN"][0]["MESSAGE"][0]
              ) {
                case "SUCCESS":
                  return res.status(200).send({
                    message: `Profile Updated`,
                  });
                  break;
                case "ERROR_IN_SELECTION":
                  return res.status(404).send({
                    message: `Not Found`,
                  });
                  break;
                default:
                  return res.status(501).send({
                    message: `Error in Updation`,
                  });
                  break;
              }
            } else {
              return res.status(501).send({
                message: `Error in Updation`,
              });
              return;
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
  var builder = new xml2js.Builder();
  const cust_det = {
    CUST_DET: {
      CUSTOMER: req.user.username,
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

  try {
    const cust_det_xml = builder.buildObject(cust_det).slice(56);
    request.write(
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n    <soapenv:Header/>\r\n    <soapenv:Body>\r\n        <urn:ZBAPI_SSR_CUSTDETUPD>
    ${cust_det_xml}
    </urn:ZBAPI_SSR_CUSTDETUPD>\r\n    </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for POST /master-data
//To create a new Customer Record in Master Table
/**************************
  req.body Format
  {
    "firstname": "string",
    "lastname": "string",
    "tel": "string",
    "street": "string",
    "pcode": "123456",
    "city": "string",
    "country": "IN",
    "language": "string",
    "curr": "string",
    "region": "22",
    "sorg": "SA01",
    "distChannel": "S1",
    "div": "S1",
    "ref": "TESTCRD"
  }
***************************/
router.post("/master-data", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTMASTERDATA&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
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
            console.error(
              result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"][0][
                "faultstring"
              ][0]
            );
            return res
              .status(501)
              .send({ message: "Something's wrong with SAP" });
          } else {
            if (
              result["SOAP:Envelope"]["SOAP:Body"][0][
                "ns0:ZBAPI_SSR_CUSTMASTERDATA.Response"
              ]
            ) {
              if (
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTMASTERDATA.Response"
                ][0]["RETURN"][0]["TYPE"][0] === "S"
              )
                return res.status(200).send({
                  message: `Record Created`,
                  cust_id: parseInt(
                    result["SOAP:Envelope"]["SOAP:Body"][0][
                      "ns0:ZBAPI_SSR_CUSTMASTERDATA.Response"
                    ][0]["CUST_ID"][0]
                  ),
                });
              else
                return res.status(501).send({
                  message: `Error During Creation`,
                });
            } else
              return res.status(501).send({
                message: `Error During Creation`,
              });
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
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTMASTERDATA>
      <FIRST_NAME>${req.body.firstname}</FIRST_NAME>
      <LAST_NAME>${req.body.lastname}</LAST_NAME>
      <TELEPHONE>${req.body.tel}</TELEPHONE>
      <STREET>${req.body.street}</STREET>
      <POSTAL_CODE>${req.body.pcode}</POSTAL_CODE>
      <CITY>${req.body.city}</CITY>
      <COUNTRY>${req.body.country}</COUNTRY>
      <LANGUAGE_P>${req.body.language}</LANGUAGE_P>
      <CURRENCY>${req.body.curr}</CURRENCY>
      <REGION>${req.body.region}</REGION>
      <SORG>${req.body.sorg}</SORG>
      <DISTCHANNEL>${req.body.distChannel}</DISTCHANNEL>
      <DIVISION>${req.body.div}</DIVISION>
      <REF_CUSTOMER>${req.body.ref}</REF_CUSTOMER>
      </urn:ZBAPI_SSR_CUSTMASTERDATA>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

router.use(require("../customer/fi.route"));
router.use(require("../customer/sd.route"));

module.exports = router;
