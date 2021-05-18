const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const parseString = require("xml2js").parseString;
const http = require("http");
// const util = require("util");
// console.log(util.inspect(result, { showHidden:true,depth: null }));

const authRoute = express();
authRoute.use(bodyParser.json());

const accessTokenGenerator = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "360031556926s",
  });
};

//Endpoint for POST /login
//To log in as an user
/**************************
  req.body Format
  {
    "username": String,
    "password": String,
  }
***************************/
authRoute.post("/login", (req, res) => {
  const { username, password, role } = req.body;
  console.log(req.body);
  if (!(username && password && role)) {
    res.status(400).send({
      message: "Bad Request Body.",
    });
  } else {
    if (role === "customer") {
      var options = {
        method: "POST",
        hostname: "dxktpipo.kaarcloud.com",
        port: "50000",
        path: "/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SSR_CUST&receiverParty=&receiverService=&interface=SI_SSR_CUSTAUTH&interfaceNamespace=https%3A%2F%2Fssr-portals.com%2Fcustomer",
        headers: {
          authorization: "Basic cG91c2VyOlRlY2hAMjAyMQ==",
          "content-type": "text/xml",
          soapaction: '\\"http://sap.com/xi/WebService/soap1.1\\"',
          "cache-control": "no-cache",
          "postman-token": "4bd8bbb0-7f9b-59de-a290-854aa1680d48",
        },
      };

      var request = http.request(options, (response) => {
        var chunks = [];

        response.on("data", (chunk) => {
          chunks.push(chunk);
        });

        response.on("end", () => {
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
                return;
              } else {
                if (
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTAUTH.Response"
                  ][0]["RETURN"][0]["MESSAGE"][0] === "UNAUTHORIZED"
                ) {
                  res.status(401).send({
                    message: `Invalid Credentials`,
                  });
                  return;
                } else if (
                  result["SOAP:Envelope"]["SOAP:Body"][0][
                    "ns0:ZBAPI_SSR_CUSTAUTH.Response"
                  ][0]["RETURN"][0]["MESSAGE"][0] === "FORBIDDEN"
                ) {
                  res.status(401).send({
                    message: `Invalid Username`,
                  });
                  return;
                }
              }
            } catch (error) {
              console.error(error);
              res.status(500).send({ message: "Internal Server Error" });

              return;
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

            res.status(200).send({ ...data });
          });
        });

        response.on("error", (error) => {
          console.error(error);
        });
      });
      try {
        request.write(
          `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <urn:ZBAPI_SSR_CUSTAUTH>\r\n         <!--You may enter the following 2 items in any order-->\r\n         <PASSWORD>${password}</PASSWORD>\r\n         <USERNAME>${username}</USERNAME>\r\n      </urn:ZBAPI_SSR_CUSTAUTH>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`
        );
        request.end();
      } catch (error) {
        console.error(error);
        res.status(501).send({ message: "Something's wrong" });
      }
    } else if (role === "vendor") {
    } else if (role === "employee") {
    } else {
      res.status(401).send({
        message: `Invalid credentials`,
      });
      return;
    }
  }
});

module.exports = authRoute;
