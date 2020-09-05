const express = require("express");
const ws = require("ws");

const app = express();
app.use(express.json());

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection", socket => {
 socket.on("message", message => {
  wsServer.clients.forEach(client => client.send(message));
 });
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(3000, () => console.log("Now listening on port 3000."));
server.on("upgrade", (request, socket, head) => {
 wsServer.handleUpgrade(request, socket, head, socket => {
  wsServer.emit("connection", socket, request);
 });
});