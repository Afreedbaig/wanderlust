const review = require("../models/review");
const listing = require("../models/listing");
// const router = express.Router({ mergeParams: true });

module.exports.postrev = async (req, res) => {
  let { id } = req.params;
  let data = req.body.review;
  data.user = req.user.username;
  //   console.log(data);
  let bata = new review(data);
  // console.log(user);
  // bata.user = req.user.username;
  // console.log(beta);
  let dataa = await listing.findById(`${id}`);
  // console.log(dataa);
  dataa.reviews.push(bata);
  await bata.save();
  await dataa.save();
  req.flash("success", "Review Added");
  res.redirect(`/listings/${id}/`);
};

module.exports.revdelete = async (req, res) => {
  let { id, reviewId } = req.params;

  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId).then((data) => {
    console.log(data);
  });
  req.flash("success", " Review Deleted ");
  res.redirect(`/listings/${id}`);
};
