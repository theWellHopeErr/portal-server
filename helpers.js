const jwt = require("jsonwebtoken");

const accessTokenGenerator = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "360031556926s",
  });
};

const flattenJSONArray = (res) => {
  res.map((o) => Object.keys(o).map((key) => (o[key] = o[key][0])));
};

const flattenJSON = (res) => {
  Object.keys(res).map((o) => (res[o] = res[o][0]));
};

module.exports = { accessTokenGenerator, flattenJSONArray, flattenJSON };
