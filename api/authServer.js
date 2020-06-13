var express = require('express');
var app = express();
var jwt = require("jsonwebtoken");
const database = require("./database");
require('dotenv').config()

app.use(express.json());

app.post("/auth/register", database.register);

app.post("/auth/login", database.login);

app.post("/auth/refresh", database.refresh);

app.post("/auth/logout", database.logout);

app.post("/auth/forceLogout", database.forceLogout);

app.get("/auth/test", authenticateToken, (req, res) => {
    res.status(204).send("valid");
})

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

app.listen(4001);