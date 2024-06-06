const express = require("express");
const app = express();
const Router = express.Router({ mergeParams: true });
const passport = require("passport");

const { smt } = require("../middleware.js");

const {
  signup,
  signpostt,
  login,
  loginpostt,
  logout,
} = require("../controllers/user.js");

Router.route("/signup").get(signup).post(signpostt);

Router.route("/login")
  .get(login)
  .post(
    smt,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    loginpostt
  );

Router.get("/logout", logout);

app.use((req, res, next) => {
  let { statusCode = 404, message = "page not found" } = err;
  // res.status(statusCode).send(message)
  //   res.status(statusCode);
  res.render("error.ejs", { err });
  next(err);
});

module.exports = Router;
