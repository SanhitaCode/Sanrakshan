require("dotenv").config();

const http = require("http");
const socketIo = require("socket.io");

const app = require("./app");

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io
const io = socketIo(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
});

// Make io available inside controllers
app.set("io", io);

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});
