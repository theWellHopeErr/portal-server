var express = require("express");
var router = express.Router();

router.use((req, res, next) => {
  if (req.user.role === "vendor") next();
  else return res.status(401).send({ message: "Unauthorized" });
});

router.get("/", function (req, res) {
  res.send("Vendor Router Working");
});

module.exports = router;
