var NodeSSH = require("node-ssh");
ssh = new NodeSSH();

ssh.connect({
    host: 'seidlserver.ddns.net',
    username: "arkserver",
    privateKey: 'D:/10jon/Documents/ssh/arkserverkey.ppk'
}).catch((err) => {
    console.log(err.message)
})

const manageServer = (req, res) => {
    var servername = req.body.servername;
    var instruction = req.body.instruction;
    var cdString = "cd /home/" + servername;
    var executeString = "./" + servername + " " + instruction;


    

    ssh.execCommand(cdString+";"+executeString).then((result) => {
        if ((result.stderr).length > 0) {
            res.status(500).json({message: result.stdout})
        }
        else {  
            res.status(204).json({message: result.stdout})
        }
    })
        .catch((err) => {
            res.sendStatus(500);
        })
}
module.exports = {manageServer}