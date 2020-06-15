var express = require('express');
var app = express();
var jwt = require("jsonwebtoken");
var server = require("./serverCommands");
require('dotenv').config()

app.use(express.json());

app.post("/api/start", server.start);

app.post("/api/shutdown", server.shutdown);

app.post("/api/restart", authenticateToken, server.restart);


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
      return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err){
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    })
  }

app.listen(4000);