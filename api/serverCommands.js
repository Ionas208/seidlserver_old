var wol = require('wakeonlan');
fs = require('fs')
path = require('path')
var NodeSSH = require("node-ssh");
ssh = new NodeSSH();
var ping = require('ping');

ssh.connect({
    host: 'seidlserver.ddns.net',
    username: 'api',
    privateKey: 'D:/10jon/Documents/ssh/apikey.ppk'
})

const start = (req, res) => {
    wol("FC:AA:14:1F:9F:AB", (err) => {
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
    ping.promise.probe("10.0.0.1", { timeout: 10, deadline: 50 }
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
            host: 'seidlserver.ddns.net',
            username: 'api',
            privateKey: 'D:/10jon/Documents/ssh/apikey.ppk'
        })
    }
}


module.exports = { start, shutdown, restart, getStatus, getCpuMetrics, getRamMetrics}