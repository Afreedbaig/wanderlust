const ExpressError = require("./ExpressError");

module.exports = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      return next(new ExpressError(400, err.message));
    });
  };
};
