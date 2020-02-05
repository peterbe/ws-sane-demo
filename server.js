const sane = require("sane");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
function send(msg) {
  let i = 0;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      i++;
      console.log(`SENDING (${i})...`, msg);
      client.send(msg);
    }
  });
  console.log(`Sent to ${i} open clients`);
}
// send(`IMMEDIATELY!!`);

// wss.on("connection", ws => {
//   console.log(
//     "Connection established",
//     Array.from(wss.clients).filter(c => c.readyState === WebSocket.OPEN).length
//   );
// });

const watcher = sane(".", { glob: ["**/*.js", "**/*.css", "**/*.html"] });
watcher.on("ready", function() {
  console.log("ready");
});
watcher.on("change", function(filepath, root, stat) {
  console.log("file changed", filepath);
  send(`CHANGE: ${filepath}`);
});
watcher.on("add", function(filepath, root, stat) {
  console.log("file added", filepath);
  send(`ADD: ${filepath}`);
});
watcher.on("delete", function(filepath, root) {
  console.log("file deleted", filepath);
  send(`DELETE: ${filepath}`);
});

// close
// watcher.close();

function noop() {}
function heartbeat() {
  this.isAlive = true;
}
wss.on("connection", function connection(ws) {
  ws.isAlive = true;
  ws.on("pong", heartbeat);
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      console.log("Terminate client!");
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10e3);
