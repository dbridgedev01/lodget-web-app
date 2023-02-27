const express = require("express");
const mongoose = require("mongoose")
const path = require("path");
require("dotenv").config();
const Lodge = require("./models/lodge");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("home");
});

// Database Connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected To Database.");
  })
  .catch((err) => {
    console.log(err);
  });

// Server
app.listen(3000, () => {
    console.log("Server Started, Listening on Port 3000.");
});

app.get("/test", async(req, res) => {
    let lodge = new Lodge({title: "Test Lodge", location: "Bengaluru"});
    lodge = await lodge.save();
    res.status(200).send(lodge);
});