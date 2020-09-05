const express = require("express");
const ws = require("ws");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express()
 .use(express.static(__dirname))
 .get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

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
const server = app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));
server.on("upgrade", (request, socket, head) => {
 wsServer.handleUpgrade(request, socket, head, socket => {
  wsServer.emit("connection", socket, request);
 });
});