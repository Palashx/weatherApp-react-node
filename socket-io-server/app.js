const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 3001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

const getApiAndEmit = async (socket) => {
    try {
      const res = await axios.get('https://api.darksky.net/forecast/1486fc9b27ca757ed308d75cb2f0ecac/23.2599,77.4126'); // get request to dark sky
      socket.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
      console.log(res.data.currently.temperature);
    } catch (error) {
      console.error(`Error: ${error.code}`);
    }
  };

let interval;

io.on('connection', socket => {
  console.log('New client connected');
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
    }
);
