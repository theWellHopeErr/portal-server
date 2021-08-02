const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (req.user.role === "maintenance") next();
  else return res.status(401).send({ message: "Unauthorized" });
});

router.get("/", function (req, res) {
  res.send(`Maintenance Router Working with user ${req.user.username}`);
});

router.use(require("../maintenance/pm.route"));

module.exports = router;
