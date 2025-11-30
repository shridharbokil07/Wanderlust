if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// DB URL from .env
const dbUrl = process.env.MONGO_URL;

// MongoDB Connection
async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
main();

// ==============================
// TEMPLATE ENGINE + MIDDLEWARE
// ==============================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// ==============================
// SESSION + FLASH CONFIG
// ==============================
const store = MongoStore.create({
  mongoUrl: dbUrl,
  // crypto: {
  //   secret: "mysupersecretcode",
  // },
  touchAfter: 24 * 60 * 60,
});

store.on("error", (e) => {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  // store: MongoStore.create({ mongoUrl: dbUrl }),
  store: store,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ==============================
// PASSPORT AUTH SETUP
// ==============================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ==============================
// ROUTES
// ==============================

// Root
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ==============================
// ERROR HANDLING
// ==============================
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;

  // Prevent "Cannot set headers after they are sent"
  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).render("error.ejs", { statusCode, message });
});


// ==============================
// SERVER
// ==============================
app.listen(8080, () => {
  console.log("🚀 Server is listening on port 8080");
});
