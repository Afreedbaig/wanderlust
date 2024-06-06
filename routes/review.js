const express = require("express");
const router = express.Router({ mergeParams: true });
// const { reviewSchema } = require("../schema.js");
const WrapAsync = require("../utils/WrapAsync.js");
const { isLogged } = require("../middleware.js");
// const ExpressError = require("../utils/ExpressError.js");

const { validatereview } = require("../validator.js");

const { postrev, revdelete } = require("../controllers/review.js");

router.post("/", isLogged, validatereview, WrapAsync(postrev));

router.delete("/:reviewId", isLogged, WrapAsync(revdelete));

router.get("/", (req, res) => {
  let { id } = req.params;
  res.redirect(`/listings/${id}`);
});

module.exports = router;
