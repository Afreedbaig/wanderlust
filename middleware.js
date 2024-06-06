module.exports.isLogged = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to do that");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports.checkLogged = (req, res, next) => {
  if (req.user) {
    req.flash("success", "you are already logged in");
    res.redirect("/listing");
  } else {
    next();
  }
};

// module.exports.checkLoggedOut = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     req.flash("error", "Login first!!!");
//     res.redirect("/login");
//   } else {
//     next();
//   }
// };

module.exports.smt = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
