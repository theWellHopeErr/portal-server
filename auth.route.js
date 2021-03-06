const express = require("express");
const bodyParser = require("body-parser");
const parseString = require("xml2js").parseString;
const http = require("http");
const { accessTokenGenerator } = require("./helpers");
// const util = require("util");
// console.log(util.inspect(result, { showHidden:true,depth: null }));

const authRoute = express();
authRoute.use(bodyParser.json());

//Endpoint for POST /login
//To log in as an user
/**************************
  req.body Format
  {
    "username": "string",
    "password": "string",
  }
***************************/
authRoute.post("/login", (req, res) => {
  const { username, password, role } = req.body;
  if (!(username && password && role)) {
    return res.status(400).send({
      message: "Bad Request Body.",
    });
  } else {
    if (role === "customer") {
      const options = {
        method: "POST",
        hostname: "dxktpipo.kaarcloud.com",
        port: 50000,
        path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTAUTH&interfaceNamespace=https://ssr-portals.com/customer",
        headers: {
          "Content-Type": "text/xml",
          Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
          Cookie:
            "MYSAPSSO2=AjExMDAgAA1wb3J0YWw6UE9VU0VSiAAHZGVmYXVsdAEABlBPVVNFUgIAAzAwMAMAA0tQTwQADDIwMjEwNTIwMDUzMQUABAAAAAgKAAZQT1VTRVL%2FAQQwggEABgkqhkiG9w0BBwKggfIwge8CAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGBzzCBzAIBATAiMB0xDDAKBgNVBAMTA0tQTzENMAsGA1UECxMESjJFRQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjEwNTIwMDUzMTQ5WjAjBgkqhkiG9w0BCQQxFgQU0PzA74N6gRRQ1mQs!9Huca9JJ%2FwwCQYHKoZIzjgEAwQuMCwCFF50JW%2FmXmrfOfSZA5AEdtvn21P1AhQVfb5g!GY1zDT3EmF%2F3EgLLHQCUQ%3D%3D; JSESSIONID=ejz1-dHlQ3ftfg7yLgH-32ZuL0KIeQF-Y2kA_SAPpQ5dIe044JK3d_c4p73JE5rn; saplb_*=(J2EE6906720)6906750",
        },
        maxRedirects: 20,
      };

      const request = http.request(options, (response) => {
        const chunks = [];

        response.on("data", (chunk) => {
          chunks.push(chunk);
        });

        response.on("end", () => {
          const body = Buffer.concat(chunks);
          parseString(body, (err, result) => {
            try {
              if (result["SOAP:Envelope"]["SOAP:Body"][0]["SOAP:Fault"]) {
                console.log(
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
                    "ns0:ZBAPI_SSR_CUSTAUTH.Response"
                  ][0]["RETURN"][0]["MESSAGE"][0] === "UNAUTHORIZED"
                ) {
                  return res.status(401).send({
                    message: `Invalid Credentials`,
                  });
                } else if (
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTAUTH.Response"
                  ][0]["RETURN"][0]["MESSAGE"][0] === "FORBIDDEN"
                ) {
                  return res.status(401).send({
                    message: `Invalid Username`,
                  });
                }
              }
            } catch (error) {
              console.error(error);
              return res.status(500).send({ message: "Internal Server Error" });
            }
            const accessToken = accessTokenGenerator({
              username: req.body.username,
              role: req.body.role,
            });

            const data = {
              username: req.body.username,
              role: req.body.role,
              accessToken,
            };

            return res.status(200).send({ ...data });
          });
        });

        response.on("error", (error) => {
          console.error(error);
        });
      });
      try {
        request.write(
          `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:sap-com:document:sap:rfc:functions\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTAUTH>\r\n         <!--You may enter the following 2 items in any order-->\r\n         <PASSWORD>${password}</PASSWORD>\r\n         <USERNAME>${username}</USERNAME>\r\n      </urn:ZBAPI_SSR_CUSTAUTH>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
        );
        request.end();
      } catch (error) {
        console.error(error);
        return res.status(501).send({ message: "Something's wrong" });
      }
    } else if (role === "vendor") {
      const options = {
        method: "POST",
        hostname: "dxktpipo.kaarcloud.com",
        port: 50000,
        path: "/RESTAdapter/ssr-vendor/login",
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

        response.on("end", () => {
          const body = JSON.parse(Buffer.concat(chunks).toString());
          switch (body.RETURN.MESSAGE) {
            case "FORBIDDEN":
              return res.status(401).send({
                message: `Invalid Username`,
              });
            case "UNAUTHORIZED":
              return res.status(401).send({
                message: `Invalid Credentials`,
              });
            case "SUCCESS":
              const accessToken = accessTokenGenerator({
                username: req.body.username,
                role: req.body.role,
              });
              const data = {
                username: req.body.username,
                role: req.body.role,
                accessToken,
              };
              return res.status(200).send({ ...data });
            default:
              return res
                .status(501)
                .send({ message: "Something's wrong with SAP" });
          }
        });

        response.on("error", (error) => {
          console.error(error);
        });
      });

      try {
        const postData = JSON.stringify({
          USERNAME: username,
          PASSWORD: password,
        });
        request.write(postData);
        request.end();
      } catch (error) {
        console.error(error);
        return res.status(501).send({ message: "Something's wrong" });
      }
    } else if (role === "employee") {
      const options = {
        method: "POST",
        hostname: "dxktpipo.kaarcloud.com",
        port: 50000,
        path: "/RESTAdapter/ssr-employee/login",
        headers: {
          Authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
          "Content-Type": "application/json",
          Cookie:
            "JSESSIONID=yGvTTaeWlh1_i--O1V8C07a-_vc2egF-Y2kA_SAPh0gkn2s79bVWSkmre2vnLOHi; JSESSIONMARKID=_HC5aAMu1vqQiKzNS7wuD-WyvEkc83Ngnkun5jaQA; saplb_*=(J2EE6906720)6906750",
        },
        maxRedirects: 20,
      };

      const request = http.request(options, (response) => {
        const chunks = [];

        response.on("data", (chunk) => {
          chunks.push(chunk);
        });

        response.on("end", () => {
          const body = JSON.parse(Buffer.concat(chunks).toString());
          switch (body.RETURN.MESSAGE) {
            case "FORBIDDEN":
              return res.status(401).send({
                message: `Invalid Username`,
              });
            case "UNAUTHORIZED":
              return res.status(401).send({
                message: `Invalid Credentials`,
              });
            case "SUCCESS":
              const accessToken = accessTokenGenerator({
                username: req.body.username,
                role: req.body.role,
              });
              const data = {
                username: req.body.username,
                role: req.body.role,
                accessToken,
              };
              return res.status(200).send({ ...data });
            default:
              return res
                .status(501)
                .send({ message: "Something's wrong with SAP" });
          }
        });

        response.on("error", (error) => {
          console.error(error);
        });
      });

      try {
        const postData = JSON.stringify({
          USERNAME: username,
          PASSWORD: password,
        });
        request.write(postData);
        request.end();
      } catch (error) {
        console.error(error);
        return res.status(501).send({ message: "Something's wrong" });
      }
    } else if (role === "maintenance") {
      const options = {
        method: "POST",
        hostname: "dxktpipo.kaarcloud.com",
        port: 50000,
        path: "/RESTAdapter/ssr-maintenance/login",
        headers: {
          Authorization: "Basic UE9VU0VSOlRlY2hAMjAyMQ==",
          "Content-Type": "application/json",
          Cookie:
            "JSESSIONID=FTnR5MwV5R5BPUqV9-LORx65xdYEewF-Y2kA_SAPzZgESG1inEZQkS_uGSHhdwPf; JSESSIONMARKID=QmyjMwrvbPXQOg5neJIIHIjxDrLmK7HBC8635jaQA; saplb_*=(J2EE6906720)6906750",
        },
        maxRedirects: 20,
      };

      const request = http.request(options, (response) => {
        const chunks = [];

        response.on("data", (chunk) => {
          chunks.push(chunk);
        });

        response.on("end", () => {
          const body = JSON.parse(Buffer.concat(chunks).toString());
          switch (body.RETURN.MESSAGE) {
            case "FORBIDDEN":
              return res.status(401).send({
                message: `Invalid Username`,
              });
            case "UNAUTHORIZED":
              return res.status(401).send({
                message: `Invalid Credentials`,
              });
            case "SUCCESS":
              const accessToken = accessTokenGenerator({
                username: req.body.username,
                role: req.body.role,
                plangrp: body.PLANGRP,
              });
              const data = {
                username: req.body.username,
                role: req.body.role,
                plangrp: body.PLANGRP,
                accessToken,
              };
              return res.status(200).send({ ...data });
            default:
              return res
                .status(501)
                .send({ message: "Something's wrong with SAP" });
          }
        });

        response.on("error", (error) => {
          console.error(error);
        });
      });

      try {
        const postData = JSON.stringify({
          USERNAME: username,
          PASSWORD: password,
        });
        request.write(postData);
        request.end();
      } catch (error) {
        console.error(error);
        return res.status(501).send({ message: "Something's wrong" });
      }
    } else {
      return res.status(401).send({
        message: `Invalid Credentials`,
      });
    }
  }
});

module.exports = authRoute;
