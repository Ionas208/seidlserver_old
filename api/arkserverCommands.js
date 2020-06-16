var config = require("./config")
var NodeSSH = require("node-ssh");
arkssh = new NodeSSH();

arkssh.connect({
    host: config.gameserver.host,
    username: config.gameserver.username,
    privateKey: config.username.privateKey
}).catch((err) => {
    console.log(err.message)
})

/*
    ****************************************************************
    This is only working for ark currently. Will try to make it
    available for more types of servers.
    ****************************************************************
*/

const startServer = (req, res) => {
    arkssh.execCommand("cd /home/arkserver; ./arkserver start").then((result) => {
        if ((result.stderr).length > 0) {
            console.log(result.stderr);
            res.status(500).json({message: result.stderr})
        }
        else {  
            console.log(result.stdout)
            res.status(200).json({message: result.stdout})
        }
    })
        .catch((err) => {
            console.log(err.message)
            res.status(500).json({error: err.message})
        })
}

const stopServer = (req, res) => {
    arkssh.execCommand("cd /home/arkserver; ./arkserver stop").then((result) => {
        if ((result.stderr).length > 0) {
            console.log(result.stderr);
            res.status(500).json({message: result.stderr})
        }
        else {  
            console.log(result.stdout)
            res.status(200).json({message: result.stdout})
        }
    })
        .catch((err) => {
            console.log(err.message)
            res.status(500).json({error: err.message})
        })
}

const restartServer = (req, res) => {
    arkssh.execCommand("cd /home/arkserver; ./arkserver restart").then((result) => {
        if ((result.stderr).length > 0) {
            console.log(result.stderr);
            res.status(500).json({message: result.stderr})
        }
        else {  
            console.log(result.stdout)
            res.status(200).json({message: result.stdout})
        }
    })
        .catch((err) => {
            console.log(err.message)
            res.status(500).json({error: err.message})
        })
}
module.exports = {startServer, stopServer, restartServer}