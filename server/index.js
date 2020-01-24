// Initializing imports
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./config/dbConfig");

mongoose.connect(dbConfig.uri);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

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

// Resident.create(
//   {
//     name: "Aniket",
//     address: "D415",
//     phone: 8708257683,
//     vehicle: "HR10AE1090"
//   },
//   (e, newRes) => {
//     console.log(newRes);
//   }
// );

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
      //TODO Handle resident

      console.log("Handle resident notification");
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

// Connecting a user through socket
io.on("connection", socket => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("User is disconnected");
  });
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));
