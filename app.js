const fs = require('fs');

const socketIOJS = fs.readFileSync('./socket.io.min.js');
const pmlrJS = fs.readFileSync('./pmlr.js');

targetFile = process.argv[2]

const server = require('http').createServer((req, res) => {
    if (req.url == '/socketiojs') {
        res.writeHead(200, { "Context-Type": "text/JavaScript" });
        res.end(socketIOJS);
    } else if (req.url == '/pmlr') {
        res.writeHead(200, { "Context-Type": "text/JavaScript" });
        res.end(pmlrJS);
    }
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


fs.watchFile(targetFile, { interval: 1000 }, (curr, prev) => {
    io.emit("change", "reload page")
});


server.listen(3000);