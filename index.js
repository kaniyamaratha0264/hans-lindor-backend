const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const route = require('./Routes/app')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const serverIO = new Server(server);
const { io } = require("socket.io-client");
var socket = io();
var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/' , route)


app.get('/', (req, res) => {
  console.log('Server started');
  res.sendFile( __dirname + '/public/index.html' );
});

serverIO.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect',(dis)=>{
   console.log('a user disconnected');
  })

  socket.on("join", async (data, callback) => {
    await socket.join(data.myId)
  });
  socket.on("hostjoin", function (room) {
    socket.join(room);
    serverIO.to(room).emit("hostjoinned", `Host - ${room} joined`);
  });
  socket.on("changeLocation", async (data, callback) => {
    try {
      serverIO.to(data.informUserId).emit("receivedlocation", data);
      callback();
    }
    catch {

    }
  })

});

server.listen(4000, () => {
  console.log('listening on *:4000');
});