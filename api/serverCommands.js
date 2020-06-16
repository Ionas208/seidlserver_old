var config = require("./config")
var wol = require('wakeonlan');
fs = require('fs')
path = require('path')
var NodeSSH = require("node-ssh");
ssh = new NodeSSH();
var ping = require('ping');

ssh.connect({
    host: config.ssh.host,
    username: config.ssh.username,
    privateKey: config.ssh.privateKey
})

const start = (req, res) => {
    wol(config.wol.mac, (err) => {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
        else {
            res.sendStatus(204);
        }
    }).catch((err) = {})
}

const shutdown = (req, res) => {
    checkForConnection()
    ssh.execCommand("sudo shutdown -P now").then(function (result) {
        if ((result.stderr).length > 0) {
            console.log(result.stderr);
            res.sendStatus(500)
        }
        else {
            res.sendStatus(204);
        }
    })
        .catch((err) => {
            console.log(err.message)
            res.sendStatus(500);
        })
}

const restart = (req, res) => {
    checkForConnection()
    ssh.execCommand("sudo reboot -P now").then(function (result) {
        if ((result.stderr).length > 0) {
            res.sendStatus(500)
        }
        else {
            res.sendStatus(204);
        }
    })
        .catch((err) => {
            res.sendStatus(500);
        })
}

const getStatus = (req, res) => {
    checkForConnection()
    ping.promise.probe(config.ping.destination, { timeout: config.ping.timeot, deadline: config.ping.deadline }
    ).then((result) => {
        res.json({ alive: result.alive });
    }).catch((err) => {
        res.json({ alive: false });
    })
}

const getCpuMetrics = (req, res) => {
    checkForConnection();
    ssh.execCommand("mpstat -o JSON").then((result) => {
        if ((result.stderr).length > 0) {
            res.sendStatus(500)
        }
        else {
            res.json(JSON.parse(result.stdout));
        }
    })
        .catch((err) => {
            res.sendStatus(500);
        })
        
    
}

const getRamMetrics = (req, res) => {
    checkForConnection();
    ssh.execCommand('cat /proc/meminfo | grep "^MemFree*" | grep -Eo "[0-9]*[0-9]"').then((result) => {
        if ((result.stderr).length > 0) {
            res.sendStatus(500)
        }
        else {
            console.log((result.stdout));
            res.json({MemFree: (parseInt(result.stdout)/1000000)});
        }
    })
        .catch((err) => {
            res.sendStatus(500);
        })
}


function checkForConnection() {
    if (ssh.connection == null) {
        ssh.connect({
            host: config.ssh.host,
            username: config.ssh.username,
            privateKey: config.ssh.privateKey
        })
    }
}


module.exports = { start, shutdown, restart, getStatus, getCpuMetrics, getRamMetrics}