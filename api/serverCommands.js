var wol = require('wakeonlan');
fs = require('fs')
path = require('path')
var NodeSSH = require("node-ssh");
ssh = new NodeSSH();

ssh.connect({
    host: 'seidlserver.ddns.net',
    username: 'api',
    privateKey: 'D:/10jon/Documents/ssh/apikey.ppk'
  })

const start = (req,res)=>{
    wol("FC:AA:14:1F:9F:AB", (err)=>{
        if(err){
            console.log(err.message);
            res.sendStatus(500);
        }
        else{
            res.sendStatus(204);
        }
    })
}

const shutdown = (req,res)=>{
    ssh.execCommand("sudo shutdown -P now").then(function(result) {
        if((result.stderr).length > 0){
            console.log(result.stderr);
            res.sendStatus(500)
        }
        else{
            res.sendStatus(204);
        }        
      })
      .catch((err)=>{
          console.log(err.message)
          res.sendStatus(500);
      })
}

const restart = (req,res)=>{
    ssh.execCommand("sudo reboot -P now").then(function(result) {
        if((result.stderr).length > 0){
            res.sendStatus(500)
        }
        else{
            res.sendStatus(204);
        }        
      })
      .catch((err)=>{
          res.sendStatus(500);
      })
}


module.exports = {start, shutdown, restart}