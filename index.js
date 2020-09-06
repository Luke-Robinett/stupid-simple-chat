$(document).ready(function () {
 const productionSocketAddress = "wss://stupid-simple-chat.herokuapp.com";
 const devSocketAddress = "ws://localhost:3000";

 const chatSocket = new WebSocket(devSocketAddress);

 chatSocket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  switch (data.type) {
   case "message":
    const messageText = `${data.username}: ${data.message}`;
    const newLi = $("<li tabindex='0' style='list-style-type: none;'>");
    newLi.text(messageText);
    $("#chat-output").append(newLi);
    break;
   case "system":
    break;
   default:
    break;
  }
 };

 chatSocket.onclose = () => console.log("Socket closed!");

 $("form").on("submit", function (event) {
  event.preventDefault();

  chatSocket.send(JSON.stringify({
   type: "message",
   username: $("#username").val(),
   message: $("#chat-input").val()
  }));
  $("#chat-input").val("");
 });

 $("#username").on("keypress", function (event) {
  const keyChar = String.fromCharCode(event.which);
  const allowed = /[a-z0-9_]/i.test(keyChar);
  if (!allowed) {
   event.preventDefault();
  }
 });

 $("#username").on("paste", function (event) {
  event.preventDefault();
 });
});
