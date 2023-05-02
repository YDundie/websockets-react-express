const Websocket = require("ws");
var express = require("express");
var router = express.Router();

const wss = new Websocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("open", function open() {
    console.log("connected");
  });

  ws.on("message", function incoming(message, isBinary) {
    console.log("received: %s", message);

    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === Websocket.OPEN) {
        client.send(`{"operation": "remove", "value": ${message}}`, {
          binary: isBinary,
        });
      }
    });
  });

  ws.on("close", function close() {
    console.log("disconnected");
  });
});

router.get("/:id", function (req, res, next) {
  const id = req.params.id;

  //send message through websocket

  wss.clients.forEach(function each(client) {
    if (client.readyState === Websocket.OPEN) {
      client.send(`{"operation": "add", "value": ${id}}`);
    }
  });

  res.send(`Added ${id} to the queue!`);
});

module.exports = router;

exports.wss = wss;
