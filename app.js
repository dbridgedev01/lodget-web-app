const express = require("express");
const mongoose = require("mongoose")
const path = require("path");
require("dotenv").config();
const Lodge = require("./models/lodge");
const methodOverride = require('method-override');
const { findByIdAndUpdate } = require("./models/lodge");
const ejsMate = require("ejs-mate");

const app = express();

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

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

app.get("/rentals", async (req, res) => {

  const lodgeList = await Lodge.find({});
  res.render("rentals/index", {lodgeList});
});

app.post("/rentals", async (req,res) => {
  const lodge = new Lodge(req.body.lodge);
  lodge.save();
  res.redirect(`/rentals/${lodge._id}`)
})

app.get("/rentals/new", (req, res) => {
  res.render("rentals/new");
});

app.get("/rentals/:id", async (req, res) => {
  const lodge = await Lodge.findById(req.params.id);
  res.render("rentals/show", {lodge});
});

app.get("/rentals/:id/edit", async (req, res) => {
  const lodge = await Lodge.findById(req.params.id);
  res.render("rentals/edit", {lodge});
});

app.put("/rentals/:id", async(req, res) => {
  const {id} = req.params;
  await Lodge.findByIdAndUpdate(id, req.body.lodge);
  res.redirect(`/rentals/${id}`)
});

app.delete("/rentals/:id", async(req, res) => {
  const {id} = req.params;
  await Lodge.findByIdAndDelete(id);
  res.redirect("/rentals");
});