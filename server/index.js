// Initializing imports
const app = require("express")();
const server = require("http").createServer(app);
var cors = require("cors");
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./config/dbConfig");
const { Expo } = require("expo-server-sdk");

let expo = new Expo();
let pushToken = null;

mongoose.connect(dbConfig.uri);

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Initialize parking graph
import iddfs from "iddfs";
const A = { name: "A", available: true };
const B = { name: "B", available: true };
const C = { name: "C", available: true };
const D = { name: "D", available: true };
const E = { name: "E", available: true };
const F = { name: "F", available: true };
const G = { name: "G", available: true };
const H = { name: "H", available: true };
const I = { name: "I", available: true };
const J = { name: "J", available: true };
const K = { name: "K", available: true };
const L = { name: "L", available: true };
const M = { name: "M", available: true };
const N = { name: "N", available: true };
const O = { name: "O", available: true };
const P = { name: "P", available: true };
const Q = { name: "Q", available: true };
const R = { name: "R", available: true };
const S = { name: "S", available: false };
const T = { name: "T", available: false };

const edges = {
  A: [B],
  B: [A, C, F],
  C: [B, D, Q],
  D: [C, F, E, G],
  E: [D, P],
  F: [B, M, H, D],
  G: [D, I],
  H: [F, K, J],
  I: [G, J],
  J: [I, H],
  K: [H, O, L],
  L: [K],
  M: [F, N],
  N: [M, S],
  O: [K, R],
  P: [E],
  Q: [C],
  R: [O],
  S: [N, T],
  T: [S]
};

console.log(iddfs);

const findNode = async () => {
  const found = await iddfs({
    initialNode: T,
    isGoal: node => node.available === true,
    expand: node => edges[node.name],
    extractId: node => node
  });

  console.log(found);
};

findNode();

// Initializing models

const residentSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: Number,
  vehicle: String,
  guest: [{ type: mongoose.Types.ObjectId, ref: "Guest" }],
  inout: [{ type: mongoose.Types.ObjectId, ref: "InOut" }]
});

const Resident = mongoose.model("Resident", residentSchema);

const guestSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  vehicle: String,
  resident_id: { type: mongoose.Types.ObjectId, ref: "Resident" }
});

const Guest = mongoose.model("Guest", guestSchema);

const unAuthSchema = new mongoose.Schema({
  name: String,
  vehicle: String,
  resident_add: { type: mongoose.Types.ObjectId, ref: "Resident" },
  time: {
    type: Date,
    default: Date.now
  }
});

const UnAuth = mongoose.model("UnAuth", unAuthSchema);

const inOutSchema = new mongoose.Schema({
  vehicle: String,
  guest_id: {
    type: mongoose.Types.ObjectId,
    ref: "Guest",
    default: null
  },
  resident_id: {
    type: mongoose.Types.ObjectId,
    ref: "Resident",
    default: null
  },
  in_time: { type: Date, default: Date.now },
  out_time: { type: Date, default: null },
  name: String
});

const InOut = mongoose.model("InOut", inOutSchema);

app.get("/test", (req, res) => {
  res.send("Connected");
});
app.post("/security/in", async (req, res) => {
  console.log(req.body);
  const { vehicle } = req.body;

  const resident = await Resident.findOne({ vehicle });

  //! Check if resident
  if (resident) {
    const inOut = await InOut.create({
      resident_id: resident._id,
      vehicle,
      name: resident.name
    });
    io.emit("inData", { ...inOut._doc });
  } else {
    //! Check if guest

    const guest = await Guest.findOne({ vehicle });
    if (guest) {
      const inOut = await InOut.create({
        guest_id: guest._id,
        vehicle,
        name: guest.name
      });
      io.emit("inData", { ...inOut._doc });
    } else {
      //! Handle resident
      io.emit("securityForm", vehicle);
    }
  }

  res.send("Succesfull");
});

app.post("/security/out", async (req, res) => {
  const { vehicle } = req.body;

  //! Upadate Out time
  const inOut = await InOut.findOneAndUpdate(
    { vehicle, out_time: null },
    { out_time: Date.now() }
  );
  console.log(inOut);
  io.emit("outData", { ...inOut._doc, out_time: new Date(Date.now()) });
  res.send("Succesfull");
});

app.post("/security/form", async (req, res) => {
  console.log(req.body);

  //TODO Handle notification
  let message = [
    {
      to: pushToken.token,
      sound: "default",
      body: "Accept request",
      data: req.body
    }
  ];
  if (!Expo.isExpoPushToken(pushToken.token)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
  }
  try {
    let ticketChunk = await expo.sendPushNotificationsAsync(message);
  } catch (e) {
    console.log(e.message);
  }
});

app.post("/expo/token", (req, res) => {
  console.log(req.body);
  pushToken = req.body;
  res.send("Succesfull");
});

app.get("/expo/sendMessage", async (req, res) => {
  console.log(pushToken.token);
  let token = pushToken.token.value;
  let message = [
    {
      to: token,
      sound: "default",
      body: "This is a test notification",
      data: { withSome: "data" }
    }
  ];
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
  }
  try {
    let ticketChunk = await expo.sendPushNotificationsAsync(message);
  } catch (e) {
    console.log(e.message);
  }
  res.send("/lol");
});

// Connecting a user through socket
io.on("connection", socket => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("User is disconnected");
  });
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));
