const User = require("../models/user.js");

module.exports.signup = (req, res) => {
  res.render("user/user.ejs");
};

module.exports.signpostt = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ email, username });
    let done = await User.register(newUser, password);
    console.log(done);
    req.login(done, (err) => {
      if (err) {
        next(err);
      } else {
        req.flash("success", `Loged in as ${done.username}`);
        res.redirect("/listing");
      }
    });
    // req.flash("success", `User created Successfully , Welcome ${username}`);
    // res.redirect("/listing");
  } catch (err) {
    res.render("user/signuperror.ejs", { err });
  }
};

module.exports.login = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.loginpostt = async (req, res) => {
  //   console.log(req.body);
  let data = await User.findOne({ username: req.body.username });
  // console.log(data);
  // let y = data.username;
  // console.log(y);
  // if (!y) {
  //   req.flash("error", "No user found , please Sign UP!!!!!");
  //   res.redirect("/signup");
  //   // res.send("bruhh");
  // } else {
  //   req.flash("success", `Login Successful , Welcome ${data.username}`);
  //   res.redirect("/listing");
  //   // res.send("Nahh");
  // }

  req.flash("success", `Login Successful , Welcome ${data.username}`);
  // console.log(req.originalUrl);
  if (res.locals.redirectUrl) {
    return res.redirect(res.locals.redirectUrl);
  } else {
    res.redirect("/listing");
  }
};

module.exports.logout = (req, res, next) => {
  if (!req.user) {
    req.flash("success", "Login First!!");
    res.redirect("/login");
  } else {
    req.logout((err) => {
      if (err) {
        next(err);
      } else {
        req.flash("error", "Loged Out Successfully!!!!");
        res.redirect("/listing");
      }
    });
  }
};
