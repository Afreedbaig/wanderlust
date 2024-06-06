if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname, "./public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");

// Auth
const User = require("./models/user.js");
const passport = require("passport");
const LocalStratagy = require("passport-local");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const sec = process.env.SECRET;

const dburl = process.env.ATLAS;
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: `${sec}`,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

sessionOptions = {
  store: store,
  secret: `${sec}`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 100,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// console.log(session);

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.eror = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const UserRouter = require("./routes/User.js");

app.use("/", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", UserRouter);
app.use((req, res, next) => {
  let err = { statusCode: 404, message: "page not found" };
  // res.status(statusCode).send(message)
  //   res.status(statusCode);
  res.render("error.ejs", { err });
});

async function main() {
  await mongoose.connect(dburl);
}

main()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.all("*", (err, req, res, next) => {
  err = new ExpressError(404, "page not found");
  next(err);
  // res.send(err.name);
});

// app.use((err,req,res,next)=>{
//     console.log(err.name)
//     next(err)
// })

// app.use((err,req,res,next)=>{
//     let {status=404,message = "some err"} = err
//     res.status(status).send(message)
// })

app.listen(8080, () => {
  console.log("server is listining to port 8080");
});
