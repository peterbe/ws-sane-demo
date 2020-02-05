import Sockette from "/node_modules/sockette/dist/sockette.mjs";

const url = "ws://localhost:8080";

const ws = new Sockette(url, {
  timeout: 3e3,
  maxAttempts: 100,
  onopen: e => {
    console.log("Connected!");
    // ws.send("Hey!");
    messages.length = 0;
    repaint();
    toggleConnected(true);
  },
  onmessage: e => {
    // console.log("Received:", e);
    messages.push({ date: new Date(), data: e.data });
    repaint();
  },
  onreconnect: e => console.log("Reconnecting..."),
  onmaximum: e => console.log("Stop Attempting!"),
  onclose: e => {
    console.log("Closed!");
    toggleConnected(false);
  },
  onerror: e => console.log("Error:", e)
});

var messages = [];

// connection.onopen = () => {
//   connection.send("hey");
//   // createForm();
// };

// connection.onerror = error => {
//   console.log(`WebSocket error: ${error}`);
// };

// connection.onmessage = e => {
//   console.log(e.data);
//   console.log(e);
//   messages.push({ date: new Date(), data: e.data });
//   repaint();
// };

function repaint() {
  let container = $("#messages");
  container.empty();
  messages.forEach(msg => {
    let node = $("<li>");
    node.append($("<b>").text(msg.date.toISOString()));
    node.append($("<code>").text(JSON.stringify(msg.data)));
    container.append(node);
  });
}

function toggleConnected(state) {
  let div = $("#state");
  if (state) {
    div
      .css("background-color", "green")
      .css("color", "white")
      .text("Connected");
  } else {
    div
      .css("background-color", "red")
      .css("color", "white")
      .text("Not connected");
  }
  div.show();
}
