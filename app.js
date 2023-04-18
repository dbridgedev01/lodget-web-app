const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressErrorHandler = require("./utils/ExpressErrorHandler");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const app = express();

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "SECRET_KEY",
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

const rentalRoutes = require("./routes/rentals");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require('./routes/users');

app.use('/', userRoutes);
app.use("/rentals", rentalRoutes);
app.use("/rentals/:id/reviews", reviewRoutes);


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


app.all("*", (req, res, next) => {
  next(new ExpressErrorHandler(404, "Page Not Found."));
})

app.use((err, req, res, next) => {
  const {statusCode=500} = err;
  if(!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error", {err})
})

// Server
app.listen(3000, () => {
  console.log("Server Started, Listening on Port 3000.");
});