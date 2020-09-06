const express = require("express");
const ws = require("ws");

const PORT = process.env.PORT || 3000;
const index = "/index.html";
const server = express()
 .use(express.static(__dirname))
 .use((req, res) => res.sendFile(index, { root: __dirname }))
 .listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

const wsServer = new ws.Server({ server });

wsServer.on("connection", socket => {
 console.log("Client connected.");
 socket.on("message", eventJson => {
  const event = JSON.parse(eventJson);
  switch (event.type) {
   case "message":
   case "system":
    wsServer.clients.forEach(client => {
     if (client.readyState === ws.OPEN) {
      client.send(eventJson);
     }
    });
    break;
   default:
    break;
  }
 });
 socket.on("close", () => console.log("Client disconnected."));
});
/*
// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));
server.on("upgrade", (request, socket, head) => {
 wsServer.handleUpgrade(request, socket, head, socket => {
  wsServer.emit("connection", socket, request);
 });
});
*/