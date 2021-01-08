const ROOM_ID = document.getElementById("roomId").className;
const socket = io('/')
const audioGrid = document.getElementById('audio')
const myPeer = new Peer();
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {};
navigator.mediaDevices.getUserMedia({
  video: false,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream);
    var userId = call.peer;
    peers[userId] = call;
    const video = document.createElement('audio');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    });
    call.on('close', () => {
      video.remove()
    });
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]){
    console.log("receving disconnect");
    peers[userId].close();
  }
});

myPeer.on('open', id => {
  socket.emit('enter-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('audio')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  audio.append(video)
}