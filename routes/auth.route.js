const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dbConnect = require("../dbConnect");
// const crypto = require("crypto");

const authRoute = express();
authRoute.use(bodyParser.json());

// const hash = (password, salt) => {
//   var hashed = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");
//   return ["pdkdf2", "10000", salt, hashed.toString("hex")].join("$");
// };

const accessTokenGenerator = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '3600s',
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
  const { username, password } = req.body;

  if (!(username && password)) {
    res.status(400).send({
      message: "Bad Request Body.",
    });
  } else {
    dbConnect
      .getDB()
      .then(async (db) => {
        const userCollection = db.collection("user");

        const user = await userCollection.findOne({ username }).catch((err) => {
          console.log("Error in finding user", err);
          throw new Error("Error in finding user");
        });

        //Wrong Username
        if (!user) {
          res.status(401).send({
            message: `Invalid credentials`,
          });
          return;
        }

        // const actualPassword = user.password;
        // const salt = actualPassword.split("$")[2];
        // const hashedPassword = hash(password, salt);

        //Wrong Password
        if (password !== user.password) {
          res.status(401).send({
            message: `Invalid credentials`,
          });
          return;
        }
        const accessToken = accessTokenGenerator({
          username: req.body.username,
          accountId: user.accountId,
        });

        const data = {
          username: user.username,
          role: user.role,
          accessToken,
        }
        
        res.status(200).send({ data });
      })
      .catch((err) => {
        console.log({ url: req.url, err });
        res.status(500).send("Runtime Error");
      });
  }
});

module.exports = authRoute;