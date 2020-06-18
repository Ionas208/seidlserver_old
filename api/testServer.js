var express = require("express");
var app = express();
var jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.json());

var start = false;
var startArk = true;

app.post("/api/start", (req, res) => {
  setTimeout(() => {
    start = true;
    res.json({ started: true });
  }, 3000);
});

app.post("/api/stop", (req, res) => {
  setTimeout(() => {
    start = false;
    res.json({ stopped: true });
  }, 3000);
});

app.post("/api/restart", (req, res) => {
  setTimeout(() => {
    start = true;
    res.json({ restarted: true });
  }, 3000);
});

app.get("/api/getStatus", (req, res) => {
  if (start) {
    res.json({ alive: true });
  } else {
    res.json({ alive: false });
  }
});

app.get("/api/getCpuMetrics", (req, res) => {
  res.json({ usage: 0.6 });
});

app.get("/api/getRamMetrics", (req, res) => {
  res.json({ MemTotal: 24, MemFree: 16 });
});

app.post("/api/startServer/Ark", (req, res) => {
  setTimeout(() => {
    ark = true;
    res.json({ started: true });
  }, 3000);
});

app.post("/api/stopServer/Ark", (req, res) => {
  setTimeout(() => {
    ark = false;
    res.json({ stopped: true });
  }, 3000);
});

app.post("/api/restartServer/Ark", (req, res) => {
  setTimeout(() => {
    ark = false;
    res.json({ restarted: true });
  }, 3000);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

app.listen(4000);
