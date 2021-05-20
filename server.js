const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
const cors = require("cors");

var customerRouter = require("./routers/customer.router");
var vendorRouter = require("./routers/vendor.router.js");
var employeeRouter = require("./routers/employee.router");

dotEnv.config();
const PORT = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(require("./auth.route"));

app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send({ message: "No access token" });

  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      console.error(err);
      return res.status(403).send({ message: "Access token expired" });
    }
    req.user = payload;
    next();
  });
});

app.use("/customer", customerRouter);
app.use("/vendor", vendorRouter);
app.use("/employee", employeeRouter);

app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);
});
