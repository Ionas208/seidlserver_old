var config = require("./config")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require("dotenv").config();

const Pool = require('pg').Pool;
const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port,
});

const prep = require('pg-prepared')

const register = (req, res) => {
    var user = req.body.user;
    if(user.email == null || user.password == null || user.first_name == null || user.last_name == null || user.username == null){
        res.sendStatus(400);
    }
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        var sql = prep("INSERT INTO users (username, first_name, last_name, email, password) VALUES(${username}, ${first_name}, ${last_name}, ${email}, ${password})");
        pool.query(sql({username: user.username, first_name: user.first_name, last_name: user.last_name, email: user.email, password: hash}), (err, result)=>{
            if(err){
                res.sendStatus(500);
            }
            else{
                res.sendStatus(204);
            }
        });
    })
}

const login = (req, res) =>{
    var user = req.body.user;
    if(user.email == null || user.password == null){
        res.sendStatus(400);
    }
    var sql = prep("SELECT password FROM users WHERE email = ${email}");
    pool.query(sql({email: user.email}), (err, result) => {
        if(err){
            res.sendStatus(500);
        }
        else if(result.rows[0] != null){
            bcrypt.compare(user.password, result.rows[0].password, (err, valid) => {
                if(err){
                    res.sendStatus(500);
                }
                else if(valid){
                    var accessToken = generateAccessToken(user);
                    var refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

                    sql = prep("SELECT userid FROM users WHERE email = ${email}");
                    pool.query(sql({email: user.email}), (err, result) => {
                        if(err){
                            res.sendStatus(500);
                        }
                        else{
                            sql = prep("INSERT INTO refresh_tokens VALUES(${refresh_token}, ${userid})");
                            pool.query(sql({refresh_token: refreshToken, userid: result.rows[0].userid}), (err, result) => {
                                if(err){
                                    console.log(err.message)
                                    res.sendStatus(500);
                                }
                            });
        
                            res.json({accessToken: accessToken, refreshToken: refreshToken});
                        }
                    })
                }
                else{
                    res.sendStatus(401);
                }
            })         
        }
        else{
            res.sendStatus(500);
        }
    });
}


const refresh = (req, res) => {
    var refreshToken = req.body.refreshToken;

    if(refreshToken == null){
        res.sendStatus(401);
    }

    var sql = prep("SELECT refresh_token FROM refresh_tokens WHERE refresh_token = ${refresh_token}");
    pool.query(sql({refresh_token: refreshToken}), (err, result = []) => {
        if(err){
            res.sendStatus(500);
        }
        else{
            if(result.rows.length == 1){
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
                    if(err){
                        res.sendStatus(403);
                    }
                    const accessToken = generateAccessToken(user);
                    res.json({accessToken: accessToken});
                })
            }
            else{
                res.sendStatus(403);
            }
        }
    })
}

const forceLogout = (req, res) => {
    var user = req.body.user;
    var sql = prep("DELETE FROM refresh_tokens WHERE userid = ${userid}");
    pool.query(sql({userid: user.userid}), (err, result) => {
        if(err){
            res.sendStatus(500);
        }
        else{
            res.sendStatus(204);
        }
    })
}

const logout = (req, res) => {
    var refreshToken = req.body.refreshToken;
    var sql = prep("DELETE FROM refresh_tokens WHERE refresh_token = ${refresh_token}");
    pool.query(sql({refresh_token: refreshToken}), (err, result) => {
        if(err){
            res.sendStatus(500);
        }
        else{
            res.sendStatus(204);
        }
    })
}

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
}


module.exports = {register, login, refresh, forceLogout, logout} 