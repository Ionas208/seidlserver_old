var config = {};

config.ssh = {
    host: "seidlserver.ddns.net",
    username: "api",
    privateKey: "D:/10jon/Documents/ssh/apikey.ppk"
}

config.gameserver = {
    host: "seidlserver.ddns.net",
    username: "arkserver",
    privateKey: "D:/10jon/Documents/ssh/arkserverkey.ppk'"
}

config.db = {
    user: "postgres",
    host: "localhost",
    database: "seidlserverdb",
    password: "postgres",
    port: 5432
}

config.ping = {
    destination: "10.0.0.1",
    timeot: 10,
    deadline: 50
}

config.wol = {
    mac: "FC:AA:14:1F:9F:AB"
}

module.exports = config;