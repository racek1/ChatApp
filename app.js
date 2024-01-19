const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const messages = [];

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('chatMessage', (message) => {
    messages.push(message);
    io.to(message.room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/messages/user/:username', (req, res) => {
  const username = req.params.username;
  const userMessages = messages.filter((message) => message.username === username);
  res.json(userMessages);
});

app.get('/api/messages/room/:room', (req, res) => {
  const room = req.params.room;
  const roomMessages = messages.filter((message) => message.room === room);
  res.json(roomMessages);
});

app.get('/api/messages/search/:keyword', (req, res) => {
  const keyword = req.params.keyword.toLowerCase();
  const filteredMessages = messages.filter((message) =>
    message.text.toLowerCase().includes(keyword)
  );
  res.json(filteredMessages);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
