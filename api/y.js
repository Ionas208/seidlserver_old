var express = require("express");
var app = express();
var cors = require('cors');

app.use(cors());

app.post("/auth/login", (req, res) => {
    /*doing stuff*/
})

app.listen(4003);