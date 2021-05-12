var express = require("express");
var router = express.Router();

router.use((req, res, next) => {
  if (req.user.role === "employee") next();
  else return res.status(401).send({ message: "Unauthorized" });
});

router.get("/", function (req, res) {
  res.send("Employee Router Working");
});

module.exports = router;
