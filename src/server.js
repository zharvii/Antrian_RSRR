const express = require("express");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const dirname = require("./config/dirname");
const setings = require("./config/settings");
const routes = require("./routes");
const db = require("./db");

dirname.set(__dirname);

setings.init(app);

db.init();

routes.init(app);

io.on("connection", function (socket) {
  io.emit("user connected");
  socket.join("private-message-room");
  socket.on("add", (pesan) => {
    io.to("private-message-room").emit("new", "New Data");
  });
  socket.on("call", (data) => {
    io.to("private-message-room").emit("sing", data);
  });
  socket.on("setpoli", (pesan) => {
    io.to("private-message-room").emit("getpoli", pesan);
  });
  socket.on("setdisplay", (data) => {
    io.to("private-message-room").emit("getdisplay", data);
  });
});

http.listen(app.get("port"), app.get("hostname"), () => {
  console.log(
    "Connected successfully to server " +
    app.get("hostname") +
    " on port : " +
    app.get("port")
  );
});
