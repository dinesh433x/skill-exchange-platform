const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.send("Server running");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

server.listen(5000, () => {
  console.log("Server + Socket running on 5000");
});
