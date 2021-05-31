const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const parseString = require("xml2js").parseString;
const util = require("util");
const { flattenJSON, flattenJSONArray } = require("../helpers");

const sd = express();
sd.use(bodyParser.json());

//Endpoint for GET /inquiry
//To retrieve Inquiry List of a Customer
/**************************
  Query Format
  /customer/inquiry
***************************/
sd.get("/inquiry", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTINQLIST&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIxMTIzMQUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIxMTIzMTI2WjAjBgkqhkiG9w0BCQQxFgQUT20Pcl%2FXfepVPHaAFdbjZ2MI1pIwCQYHKoZIzjgEAwQuMCwCFFHRW5dXGWBuKOlYsyKp5YFp98WOAhRqpi17JoxSz5bgHKx%2FCWVnfr87Gg%3D%3D; JSESSIONID=Dt0Vs0pr82pdeOAaigz_x9tYtuiOeQF-Y2kA_SAPIezMd_ktzQNgb1pnKVMXNAN8; JSESSIONMARKID=2JTJ2guNNRr-h0EU91BG4Ogjo17Fh2WJ0Kon5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (resp) => {
    const chunks = [];

    resp.on("data", function (chunk) {
      chunks.push(chunk);
    });

    resp.on("end", function (chunk) {
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
                "ns0:ZBAPI_SSR_CUSTINQLIST.Response"
              ][0]["RETURN"][0]["TYPE"][0] === "E"
            ) {
              return res.status(404).send({ message: "Records Not Found!!" });
            } else {
              response =
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTINQLIST.Response"
                ][0]["IT_VBAK"][0]["item"];
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

    resp.on("error", function (error) {
      console.error(error);
    });
  });

  try {
    request.write(
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTINQLIST>\r\n         <CUST_ID>${req.user.username}</CUST_ID>\r\n      </urn:ZBAPI_SSR_CUSTINQLIST>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /inquiry-details
//To retrieve Inquiry Details of a salesdocument
/**************************
  Query Format
  /customer/inquiry-details?sd={salesdocument}
***************************/
sd.get("/inquiry-details", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTINQDET&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIxMDQ0MAUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIxMDQ0MDExWjAjBgkqhkiG9w0BCQQxFgQURbqbczBUenNSVHxQMI%2F1Jb%2FSGoYwCQYHKoZIzjgEAwQuMCwCFHLN9rqQRCw74qmbQ7YFr4a2uxcpAhR9Ta1hJan6!1YYTEwgNgj4GAPYTA%3D%3D; JSESSIONID=YFvEWkRUILjqkSDyCeRjXK87RjmNeQF-Y2kA_SAPXK3_aQjcqxXpYYD-DtaMTTnh; JSESSIONMARKID=Xwyy-gc7qbSCtQQmosOuf9ls5x9gQGeRVNiH5jaQA; saplb_*=(J2EE6906720)6906750",
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
                "ns0:ZBAPI_SSR_CUSTINQDET.Response"
              ][0]["RETURN"][0] &&
              result["SOAP:Envelope"]["SOAP:Body"][0][
                "ns0:ZBAPI_SSR_CUSTINQDET.Response"
              ][0]["RETURN"][0]["item"][0]["TYPE"]
            ) {
              console.error({
                message:
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTINQDET.Response"
                  ][0]["RETURN"][0]["item"][0]["MESSAGE"][0],
              });
              return res.status(404).send({
                message:
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTINQDET.Response"
                  ][0]["RETURN"][0]["item"][0]["MESSAGE"][0],
              });
            } else {
              let header;
              let item;
              if (
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTINQDET.Response"
                ][0]["HEADER"][0]
              )
                header =
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTINQDET.Response"
                  ][0]["HEADER"][0];
              flattenJSON(header);

              if (
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTINQDET.Response"
                ][0]["ITEMS"][0]["item"][0]
              )
                item =
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTINQDET.Response"
                  ][0]["ITEMS"][0]["item"][0];
              flattenJSON(item);

              const response = { header, item };
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
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTINQDET>\r\n         <SALESDOCUMENT>${req.query.sd}</SALESDOCUMENT>\r\n      </urn:ZBAPI_SSR_CUSTINQDET>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /so
//To retrieve Sales Order List of a Customer
/**************************
  Query Format
  /customer/so
***************************/
sd.get("/so", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTSOLIST&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIxMTIzMQUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIxMTIzMTI2WjAjBgkqhkiG9w0BCQQxFgQUT20Pcl%2FXfepVPHaAFdbjZ2MI1pIwCQYHKoZIzjgEAwQuMCwCFFHRW5dXGWBuKOlYsyKp5YFp98WOAhRqpi17JoxSz5bgHKx%2FCWVnfr87Gg%3D%3D; JSESSIONID=Dt0Vs0pr82pdeOAaigz_x9tYtuiOeQF-Y2kA_SAPIezMd_ktzQNgb1pnKVMXNAN8; JSESSIONMARKID=2JTJ2guNNRr-h0EU91BG4Ogjo17Fh2WJ0Kon5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (resp) => {
    const chunks = [];

    resp.on("data", function (chunk) {
      chunks.push(chunk);
    });

    resp.on("end", function (chunk) {
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
                "ns0:ZBAPI_SSR_CUSTSOLIST.Response"
              ][0]["RETURN"][0]["TYPE"][0] === "E"
            ) {
              return res.status(404).send({ message: "Records Not Found!!" });
            } else {
              response =
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTSOLIST.Response"
                ][0]["IT_VBAK"][0]["item"];
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

    resp.on("error", function (error) {
      console.error(error);
    });
  });

  try {
    request.write(
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTSOLIST>\r\n      \t<CUST_ID>${req.user.username}</CUST_ID>\r\n      </urn:ZBAPI_SSR_CUSTSOLIST>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /so-details
//To retrieve Sales Order Details of a salesdocument
/**************************
  Query Format
  /customer/so-details?sd={salesdocument}
***************************/
sd.get("/so-details", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTSODET&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIwMDUzMQUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIwMDUzMTQ5WjAjBgkqhkiG9w0BCQQxFgQU0PzA74N6gRRQ1mQs!9Huca9JJ%2FwwCQYHKoZIzjgEAwQuMCwCFF50JW%2FmXmrfOfSZA5AEdtvn21P1AhQVfb5g!GY1zDT3EmF%2F3EgLLHQCUQ%3D%3D; JSESSIONID=OzlYo4jEjIiR-n0RU3Rj_WAE3U2IeQF-Y2kA_SAPbf3GsYE5As4fUIrmCfj2Rtkh; JSESSIONMARKID=ZGOMbgyKO5kcyYv8BOHWVWi8cRn9bXTf87PX5jaQA; saplb_*=(J2EE6906720)6906750",
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
                "ns0:ZBAPI_SSR_CUSTSODET.Response"
              ][0]["RETURN"][0] &&
              result["SOAP:Envelope"]["SOAP:Body"][0][
                "ns0:ZBAPI_SSR_CUSTSODET.Response"
              ][0]["RETURN"][0]["item"][0]["TYPE"]
            ) {
              console.error({
                message:
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTSODET.Response"
                  ][0]["RETURN"][0]["item"][0]["MESSAGE"][0],
              });
              return res.status(404).send({
                message:
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTSODET.Response"
                  ][0]["RETURN"][0]["item"][0]["MESSAGE"][0],
              });
            } else {
              let header;
              let item;
              if (
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTSODET.Response"
                ][0]["HEADER"][0]
              )
                header =
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTSODET.Response"
                  ][0]["HEADER"][0];
              flattenJSON(header);

              if (
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTSODET.Response"
                ][0]["ITEMS"][0]["item"][0]
              )
                item =
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTSODET.Response"
                  ][0]["ITEMS"][0]["item"][0];
              flattenJSON(item);

              const response = { header, item };
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
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTSODET>\r\n         <SALESDOCUMENT>${req.query.sd}</SALESDOCUMENT>\r\n      </urn:ZBAPI_SSR_CUSTSODET>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /lod
//To retrieve Delivery List of a Customer
/**************************
  Query Format
  /customer/lod
***************************/
sd.get("/lod", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTDELLIST&interfaceNamespace=https://ssr-portals.com/customer",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
      Cookie:
        "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIxMTIzMQUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIxMTIzMTI2WjAjBgkqhkiG9w0BCQQxFgQUT20Pcl%2FXfepVPHaAFdbjZ2MI1pIwCQYHKoZIzjgEAwQuMCwCFFHRW5dXGWBuKOlYsyKp5YFp98WOAhRqpi17JoxSz5bgHKx%2FCWVnfr87Gg%3D%3D; JSESSIONID=Dt0Vs0pr82pdeOAaigz_x9tYtuiOeQF-Y2kA_SAPIezMd_ktzQNgb1pnKVMXNAN8; JSESSIONMARKID=2JTJ2guNNRr-h0EU91BG4Ogjo17Fh2WJ0Kon5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (resp) => {
    const chunks = [];

    resp.on("data", function (chunk) {
      chunks.push(chunk);
    });

    resp.on("end", function (chunk) {
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
                "ns0:ZBAPI_SSR_CUSTDELLIST.Response"
              ][0]["RETURN"][0]["TYPE"][0] === "E"
            ) {
              return res.status(404).send({ message: "Records Not Found!!" });
            } else {
              response =
                result["SOAP:Envelope"]["SOAP:Body"][0][
                  "ns0:ZBAPI_SSR_CUSTDELLIST.Response"
                ][0]["IT_VBAK"][0]["item"];
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

    resp.on("error", function (error) {
      console.error(error);
    });
  });

  try {
    request.write(
      `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTDELLIST>\r\n         <CUST_ID>${req.user.username}</CUST_ID>\r\n      </urn:ZBAPI_SSR_CUSTDELLIST>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
    );
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

module.exports = sd;
