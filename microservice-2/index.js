const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const { connectConsumer, eventEmitter } = require("./common/kafka");
const { gracefullShutdown } = require("./common/utils");
require("dotenv").config();

const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("client connected to socket server... ", socket.id);
  // socket.on("request", () => {
  //   eventEmitter.on("recieved", (data) => {
  //     console.log("data ", data);
  //     if (data) {
  //       console.log("data ", data);
  //     }
  //     socket.emit("reply", data);
  //   });
  // });
  eventEmitter.on("recieved", (data) => {
    console.log("data received from producer ", data);
    if (data) {
      io.emit("reply", data);
    }
  });
  socket.on("disconnect", () => {
    console.log("client disconnected to socket server... ", socket.id);
  });
});

// Server code
(async () => {
  try {
    server.listen(process.env.PORT, () => {
      console.log("consumer server is running on port: ", process.env.PORT);
    });
    await connectConsumer();

    const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];
    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i];
      process.on(signal, () => {
        gracefullShutdown(server);
      });
    }
  } catch (error) {
    console.log("server error.... ", error);
    throw new Error("Server Connecting Error");
  }
})();
