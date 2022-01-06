const fs = require('fs');
const path = require('path');
const process = require('process');

// console.log(__filename, __dirname );




const socketIOJS = fs.readFileSync(path.resolve(__dirname, 'socket.io.min.js'));
const pmlrJS = fs.readFileSync(path.resolve(__dirname, 'pmlr.js'));


let targetFileOrDir = process.argv[2]

if (targetFileOrDir==".") targetFileOrDir = process.cwd();

let isDir = fs.statSync(targetFileOrDir).isDirectory();



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


if (isDir) {
    console.log("Watching all files in: " + targetFileOrDir)
    fs.watch(targetFileOrDir, (eventType, filename) => {     
        console.log(eventType, filename);  
        io.emit("change", "reload page")
    });
}
else {
    console.log("Watching file: " + targetFileOrDir)
    fs.watchFile(targetFileOrDir, { interval: 1000 }, (curr, prev) => {
        console.log("change " + targetFileOrDir);
        io.emit("change", "reload page")
    });
}

server.listen(3000);