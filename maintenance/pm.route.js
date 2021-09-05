const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const util = require("util");

const pm = express();
pm.use(bodyParser.json());

//Endpoint for GET /notification-list
//To retrieve List of Notification of the Plant
/**************************
  Query Format
  /maintenance/notification-list
***************************/
pm.get("/notification-list", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-maintenance/notif-list",
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

    response.on("end", (chunk) => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        const list = body.NOTIFICATION_LIST,
          noco = body.NOTIFICATION_NOCO,
          nopr = body.NOTIFICATION_NOPR,
          osno = body.NOTIFICATION_OSNO;
        if (body.RETURN.TYPE === "S")
          res.status(200).send({ list, noco, nopr, osno });
      } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Records Not Found" });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      PLANT: req.user.username,
      PLANGRP: req.user.plangrp,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /notification-det
//To retrieve Details of Notification of a Notification
/**************************
  Query Format
  /maintenance/notification-det?no={notif_no}
***************************/
pm.get("/notification-det", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-maintenance/notif-det",
    headers: {
      Authorization: "Basic UE9VU0VSOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=_QTBvjP65fhj0Nd-8kTvdLoy0D4FewF-Y2kA_SAP8TjyO2jHjswR0yCjQDlKmJmU; JSESSIONMARKID=ys49KAe6XZMMPfb_aWPksfDRuFVpdI65nv8X5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        const header = body.NOTIFICATION_HEADER,
          text = body.NOTIFICATION_TEXT;
        if (body?.RETURN?.item?.TYPE === "E")
          res.status(404).send({ message: body.RETURN.item.MESSAGE });
        else res.status(200).send({ header, text });
      } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Records Not Found" });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      NOTIFICATION_NO: req.query.no,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for POST /notification
//To create new Notification
/**************************
  req.body Format
  {
    "notif_type":"string",
    "equip_id":"string",
    "func_loc":"string",
    "priority":"string",
    "desc":"string",
    "start_mal_date":"string",
    "req_start_date":"string",
    "req_end_date":"string",
    "reported_by":"string",
  }

  eg:
    "notif_type": "B1",
    "equip_id": "10000030",
    "func_loc": "4000-300",
    "desc": "GENERAL KENOBI",
    "priority": "2",
    "start_mal_date": "2021-08-04",
    "req_start_date": "2021-08-06",
    "req_end_date": "2021-08-10",
    "reported_by": "TWHE"
***************************/
pm.post("/notification", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-maintenance/notif-create",
    headers: {
      Authorization: "Basic UE9VU0VSOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=_QTBvjP65fhj0Nd-8kTvdLoy0D4FewF-Y2kA_SAP8TjyO2jHjswR0yCjQDlKmJmU; JSESSIONMARKID=ys49KAe6XZMMPfb_aWPksfDRuFVpdI65nv8X5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        if (body.NOTIFICATION_NUMBER) {
          res.status(201).send({
            message: "Notification Created.",
            notif_no: body.NOTIFICATION_NUMBER,
          });
        } else {
          res.status(500).send({ error: body.RETURN?.MESSAGE });
        }
      } catch {
        res.status(500).send({ error: "ERROR" });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      PLANT: req.user.username,
      PLANGRP: req.user.plangrp,
      NOTIF_TYPE: req.body.notif_type,
      EQUIP_ID: req.body.equip_id,
      FUNC_LOCATION: req.body.func_loc,
      DESCRIPTION: req.body.desc,
      PRIORITY: req.body.priority,
      STRT_MALFUNC_DATE: req.body.start_mal_date,
      REQ_START_DATE: req.body.req_start_date,
      REQ_END_DATE: req.body.req_end_date,
      REPORTED_BY: req.body.reported_by,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for PUT /notification
//To update Notification Details
/**************************
  req.body Format
  {
    "notif_no": "string",
    "equip_id": "string",
    "func_loc": "string",
    "text": "string",
    "req_start_date": "string",
    "start_mal_date": "string",
    "req_end_date": "string",
    "reported_by": "string",
    "priority": "string",
  }
  All keys except NOTIF_NO and EQUIP_ID are optional
  eg:
    "notif_no": "10010179",
    "equip_id": "10000038",
    "func_loc": "HELLO THERE",
    "text": "HON-WOR2",
    "req_start_date": "2021-08-31",
    "start_mal_date": "2021-08-31",
    "req_end_date": "2021-09-30",
    "reported_by": "SUB",
    "priority": "1"
***************************/
pm.put("/notification", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-maintenance/notif-upd",
    headers: {
      Authorization: "Basic UE9VU0VSOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=_QTBvjP65fhj0Nd-8kTvdLoy0D4FewF-Y2kA_SAP8TjyO2jHjswR0yCjQDlKmJmU; JSESSIONMARKID=ys49KAe6XZMMPfb_aWPksfDRuFVpdI65nv8X5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        if (body?.RETURN?.TYPE == "S")
          return res.status(200).send({
            message: `Notification Updated`,
          });
      } catch {
        console.log(Buffer.concat(chunks).toString());
        return res.status(500).send({
          message: "Error During Updation",
        });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      NOTIF_NUMBER: req.body.notif_no,
      EQUIP_ID: req.body.equip_id,
      FUNC_LOCATION: req.body.func_loc,
      SHORT_TEXT: req.body.text,
      REQ_START_DATE: req.body.req_start_date,
      STRT_MALFUNC_DATE: req.body.start_mal_date,
      REQ_END_DATE: req.body.req_end_date,
      REPORTED_BY: req.body.reported_by,
      PRIORITY: req.body.priority,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//////////////////////////////////////////////////////////////////////////////////

//Endpoint for GET /wo-list
//To retrieve List of Work Order of the Plant
/**************************
  Query Format
  /maintenance/wo-list
***************************/
pm.get("/wo-list", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-maintenance/wo-list",
    headers: {
      Authorization: "Basic UE9VU0VSOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=_QTBvjP65fhj0Nd-8kTvdLoy0D4FewF-Y2kA_SAP8TjyO2jHjswR0yCjQDlKmJmU; JSESSIONMARKID=ys49KAe6XZMMPfb_aWPksfDRuFVpdI65nv8X5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        const list = body.WO_LIST,
          crtd = body.WO_CRTD,
          rel = body.WO_REL,
          teco = body.WO_TECO;
        if (body.RETURN.TYPE === "S")
          res.status(200).send({ list, crtd, rel, teco });
      } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Records Not Found" });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      PLANT: req.user.username.slice(0, 3) + "2",
      PLANGRP: req.user.plangrp,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for GET /wo-det
//To retrieve Details of a Work Order
/**************************
  Query Format
  /maintenance/wo-det?wo={wo_id}
***************************/
pm.get("/wo-det", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-maintenance/wo-det",
    headers: {
      Authorization: "Basic UE9VU0VSOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=XJ3ItXB-ks6NldHL0stw_TmQKo0FewF-Y2kA_SAPaAjAXR_wfwzHtPcdQC9JMe7I; JSESSIONMARKID=TsQJnwkPQPbIyb5iyf4cFioWoSLv3dRyyb9n5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        const details = body.WO_DETAILS,
          notif_det = body.NOTIFICATION_DETAILS,
          operations = body.WO_OPERATIONS,
          cost = body.WO_COST;
        if (body?.RETURN?.item?.TYPE === "E")
          res.status(404).send({ message: body.RETURN.item.MESSAGE });
        else res.status(200).send({ details, notif_det, operations, cost });
      } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Records Not Found" });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      WO_NO: req.query.wo,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for POST /work-order
//To create new Work Order
/**************************
  req.body Format
  {
    "notif_type": "string",
    "notif_no": "string",
    "order_type": "string",
    "equip_id": "string",
    "desc": "string",
  }

  eg:
    "notif_type": "1",
    "equip_id": "AA000007",
    "order_type": "PM01",
    "desc": "HELLO THERE",
    
***************************/
pm.post("/work-order", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-maintenance/wo-create",
    headers: {
      Authorization: "Basic UE9VU0VSOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=XJ3ItXB-ks6NldHL0stw_TmQKo0FewF-Y2kA_SAPaAjAXR_wfwzHtPcdQC9JMe7I; JSESSIONMARKID=TsQJnwkPQPbIyb5iyf4cFioWoSLv3dRyyb9n5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        if (body.RETURN?.item[0].TYPE === "E") {
          const message = body?.RETURN?.item.map((o) => o.MESSAGE);
          message.unshift("E");
          console.log(message);
          return res.status(500).send({ message });
        } else {
          const message = body?.RETURN?.item.map((o) => o.MESSAGE);
          message.unshift("S");
          res.status(201).send({ message });
        }
      } catch {
        res.status(500).send({ error: "ERROR" });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      NOTIFICATION_TYPE: req.body.notif_type,
      ORDER_TYPE: req.body.order_type,
      EQUIPMENT_NO: req.body.equip_id,
      OPR_DESCRIPTION: req.body.desc,
      NOTIFICATION_NO: "",
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

//Endpoint for PUT /work-order
//To update Work Order Details
/**************************
  req.body Format
  {
    "order_id":"string",
    "order_type":"string",
    "notif_type":"string",
    "opr_desc":"string",
    "pernr":"string",
    "equip_id":"string",
    "priority":"string",
    "desc":"string",
  }
  All keys except NOTIF_NO and EQUIP_ID are optional
  eg:
    "order_id":"4000771",
    "order_type":"PM01",
    "notif_type":"B1",
    "opr_desc":"HELLO THERE",
    "equip_id":"10000066",
    "priority":"4",
    "desc":"HELLO THERE"

***************************/
pm.put("/work-order", (req, res) => {
  const options = {
    method: "POST",
    hostname: "dxktpipo.kaarcloud.com",
    port: 50000,
    path: "/RESTAdapter/ssr-maintenance/wo-upd",
    headers: {
      Authorization: "Basic UE9VU0VSOlRlY2hAMjAyMQ==",
      "Content-Type": "application/json",
      Cookie:
        "JSESSIONID=XJ3ItXB-ks6NldHL0stw_TmQKo0FewF-Y2kA_SAPaAjAXR_wfwzHtPcdQC9JMe7I; JSESSIONMARKID=TsQJnwkPQPbIyb5iyf4cFioWoSLv3dRyyb9n5jaQA; saplb_*=(J2EE6906720)6906750",
    },
    maxRedirects: 20,
  };

  const request = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", (chunk) => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        if (body?.RETURN?.item[0]?.TYPE == "S") {
          const message = body?.RETURN?.item.map((o) => o.MESSAGE);
          message.unshift("S");
          return res.status(200).send({ message });
        } else
          return res.status(500).send({ error: body?.RETURN?.item.MESSAGE });
      } catch (error) {
        console.log(Buffer.concat(chunks).toString());
        console.log(error);
        return res.status(501).send({ error: "ERROR" });
      }
    });

    response.on("error", (error) => {
      console.error(error);
    });
  });

  try {
    const postData = JSON.stringify({
      ORDER_ID: req.body.order_id,
      ORDER_TYPE: req.body.order_type,
      NOTIFICATON_TYPE: req.body.notif_type,
      OPR_DESCRIPTION: req.body.opr_desc,
      PERSONNEL_NO: req.body.pernr,
      EQUIPMENT_NO: req.body.equip_id,
      PRIORITY: req.body.priority,
      DESCRIPTION: req.body.desc,
    });
    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    return res.status(501).send({ message: "Something's wrong" });
  }
});

module.exports = pm;
