const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const unitRoutes = require("./routes/units");
const userRoutes = require("./routes/user");
const User = require("./models/user");
const Unit = require("./models/unit");
const Setting = require("./models/setting");
const app = express();

mongoose
  .connect(process.env.MONGO_ATLAS_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("Connected to database!");
    Setting.findOne({ name: "dateFirstStart" }).then((result) => {
      if (!result) {
        console.log("Initializing database");
        User.initData(User);
        Unit.initData(Unit);
        Setting.initData(Setting);
      }
    });
  })
  .catch(() => {
    console.log("Contection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/units", unitRoutes);
app.use("/api/user", userRoutes);

module.exports = app;