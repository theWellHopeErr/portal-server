var express = require("express");
var router = express.Router();
const http = require("http");

router.use((req, res, next) => {
  if (req.user.role === "employee") next();
  else return res.status(401).send({ message: "Unauthorized" });
});

router.get("/", function (req, res) {
  res.send(`Employee Router Working with user ${req.user.username}`);
});

//Endpoint for GET /profile
//To get Employee Details
/**************************
  Query Format
  /employee/profile
***************************/
router.get("/profile", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-employee/profile",
    headers: {
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=yGvTTaeWlh1_i--O1V8C07a-_vc2egF-Y2kA_SAPh0gkn2s79bVWSkmre2vnLOHi; JSESSIONMARKID=dJNrvgq-vi91izVBaN_ukmQr-12Vlgb4Bnpn5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (resp) => {
    const chunks = [];

    resp.on("data", (chunk) => {
      chunks.push(chunk);
    });

    resp.on("end", (chunk) => {
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const profile = {
        eid: body.EMPL_DET.PERNR,
        name1: body.EMPL_DET.NACHN,
        name2: body.EMPL_DET.VORNA,
        title: body.EMPL_DET.TITEL,
        nationality: body.EMPL_DET.NATIO,
        p_code: body.EMPL_DET.PSTLZ,
        city: body.EMPL_DET.ORT01,
        address: body.EMPL_DET.STRAS,
        region: body.EMPL_DET.LAND,
        tel: body.EMPL_DET.TELNR,
        o_type: body.EMPL_DET.OTYPE,
        start_date: body.EMPL_DET.BEGDA,
        end_date: body.EMPL_DET.ENDDA,
        status: body.EMPL_DET.STATUS,
        comp_code: body.EMPL_DET.BUKRS,
        area: body.EMPL_DET.WERKS,
        emp_grp: body.EMPL_DET.PERSG,
        emp_subgrp: body.EMPL_DET.PERSK,
        contr_area: body.EMPL_DET.KOKRS,
        cost_center: body.EMPL_DET.KOSTL,
        org_unit: body.EMPL_DET.ORGEH,
        org_name: body.EMPL_DET.ORGEH_TXT,
        plans: body.EMPL_DET.PLANS,
        plans_txt: body.EMPL_DET.PLANS_TXT,
        role: body.EMPL_DET.STELL,
        role_txt: body.EMPL_DET.STELL_TXT,
        address_key: body.EMPL_DET.ANRED,
        gender: body.EMPL_DET.GESCH,
        dob: body.EMPL_DET.GBDAT,
        marital_key: body.EMPL_DET.FAMST,
        comm_type: body.EMPL_DET.USRTY,
        sys_id: body.EMPL_DET.SYSID,
      };
      res.send({ ...profile });
    });

    resp.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      EMPL_ID: req.user.username,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for PUT /profile
//To update Employee Details
/**************************
  req.body Format
  {
    "eid": "string",
    "name1": "string",
    "name2": "string",
    "title": "string",
    "nationality": "string",
    "p_code": "string",
    "city": "string",
    "address": "string",
    "region": "string",
    "tel": "string"
  }
  All keys are optional
***************************/
router.put("/profile", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-employee/edit-profile",
    headers: {
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=yGvTTaeWlh1_i--O1V8C07a-_vc2egF-Y2kA_SAPh0gkn2s79bVWSkmre2vnLOHi; JSESSIONMARKID=dJNrvgq-vi91izVBaN_ukmQr-12Vlgb4Bnpn5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      const body = JSON.parse(Buffer.concat(chunks).toString());
      switch (body.RETURN.MESSAGE) {
        case "SUCCESS":
          return res.status(200).send({
            message: `Profile Updated`,
          });
        case "ERROR_IN_SELECTION":
          return res.status(404).send({
            message: `Not Found`,
          });
        default:
          return res.status(501).send({
            message: `Error in Updation`,
          });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      EMPID: req.body.eid,
      FNAME: req.body.name1,
      LNAME: req.body.name2,
      TITLE: req.body.title,
      NATIONALITY: req.body.nationality,
      POSTAL: req.body.p_code,
      CITY: req.body.city,
      STREET: req.body.address,
      COUNTRY: req.body.region,
      TEL: req.body.tel,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

router.use(require("../employee/hcm.route"));

module.exports = router;
