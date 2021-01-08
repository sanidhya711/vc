const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const crypto = require("crypto");
app.set('view engine', 'ejs');
app.use(express.static('public'));

var rooms = {};

io.on('connection', socket => {

  socket.on("create-room",(data)=>{
    var roomID = crypto.randomBytes(64).toString('hex');
    rooms[roomID] = {
      name:"name",
    };
    socket.emit("redirect","/room/"+roomID);
  });

  socket.on("join-room",data=>{
    if(rooms[data]){
      socket.emit("redirect","/room/"+data);
    }else{
      socket.emit("err","room dosent exist");
    }
  });

  socket.on('enter-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    });
  });

});

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/room/:roomID', (req, res) => {
  var roomID = req.params.roomID;
  if(rooms[roomID]){
    res.render('room', {roomId: req.params.roomID});
  }else{
    res.redirect("/");
  }
});

server.listen(3000);