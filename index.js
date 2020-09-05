$(document).ready(function () {
 const productionSocketAddress = "ws://stupid-simple-chat.herokuapp.com";
 const devSocketAddress = "ws://localhost:3000";

 const chatSocket = new WebSocket(productionSocketAddress);

 chatSocket.onmessage = function (event) {
  const message = JSON.parse(event.data);
  const time = new Date();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const timeStamp = `[${hours}:${minutes}]`;
  const messageText = `${timeStamp} ${message.username}: ${message.message}`;
  const newLi = $("<li tabindex='0' style='list-style-type: none;'>");

  newLi.text(messageText);
  $("#chat-output").append(newLi);
 };

 $("form").on("submit", function (event) {
  event.preventDefault();

  chatSocket.send(JSON.stringify({
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
