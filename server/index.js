// Initializing imports
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const dbConfig = require("./config/dbConfig");
const bookshelf = require("bookshelf")(require("knex")(dbConfig));

app.use(bodyParser.urlencoded({ extended: true }));

// Initializing models

const InOut = bookshelf.Model.extend({
  tableName: "in_out",
  requireFetch: false
});
const Guest = bookshelf.Model.extend({
  tableName: "guest",
  requireFetch: false
});
const UnAuth = bookshelf.Model.extend({
  tableName: "unauth",
  requireFetch: false
});
const Resident = bookshelf.Model.extend({
  tableName: "user",
  requireFetch: false
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
