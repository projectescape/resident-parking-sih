const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

let inData = 0;
let outData = 0;

app.get("/increaseInData", (req, res) => {
  inData++;
  io.emit("inData", inData);
  res.send("Increase InData");
});

app.get("/increaseOutData", (req, res) => {
  outData++;
  io.emit("outData", outData);

  res.send("Increase OutData");
});

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("User is disconnected");
  });
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));
