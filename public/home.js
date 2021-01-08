const socket = io('/');

document.getElementById("create-room").addEventListener("click",function(){
    var roomName = document.getElementById("create-room-input").value;
    socket.emit("create-room",roomName);
});

document.getElementById("join-room").addEventListener("click",function(){
    var roomName = document.getElementById("join-room-input").value;
    socket.emit("join-room",roomName);
});

socket.on("redirect",(url)=>{
    console.log(url);
    window.location.href = url;
});

socket.on("err",err=>{
    alert(err);
});