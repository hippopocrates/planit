const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = mongoose.connection;
const NounProject = require("the-noun-project");

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/" + "heroku";

app.use(
  session({
    secret: "feedmeseymour",
    resave: false,
    saveUninitialized: false
  })
);

app.use(express.json());
app.use(express.static("public"));

// retrieve user info saved on the session object
app.get("/", (req, res) => {
  if (req.session.currentUser) {
    res.json(req.session.currentUser);
  } else {
    res.status(401).json({
      status: 401,
      message: "not logged in"
    });
  }
});

const userController = require("./controllers/users.js");
app.use("/users", userController);

const sessionsController = require("./controllers/sessions.js");
app.use("/sessions", sessionsController);

const planController = require("./controllers/plan.js");
app.use("/plan", planController);

const todoController = require("./controllers/todos.js");
app.use("/todo", todoController);

// dependency for api route
const apiController = require("./controllers/iconapi.js");
app.use("/iconapi", apiController);

app.listen(3000, () => {
  console.log("listening...");
});

mongoose.connect(
  "mongodb://localhost:27017/planner",
  { useNewUrlParser: true }
);
mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});
