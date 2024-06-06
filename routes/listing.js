const express = require("express");
const app = express();
const Router = express.Router();

const WrapAsync = require("../utils/WrapAsync.js");

// const { listingSchema } = require("../schema.js");

const ExpressError = require("../utils/ExpressError.js");

// const listing = require("../models/listing");

const { isLogged } = require("../middleware.js");

const multer = require("multer");

const { storage } = require("../cloudconfig.js");

const upload = multer({ storage });

let {
  index,
  neww,
  postt,
  editt,
  showw,
  patchh,
  deletelistings,
  search,
} = require("../controllers/listings.js");

// Router.get("/listing/",(req,res)=>{
//     res.redirect("/listing/listing")
// })

Router.route("/listing/").get(WrapAsync(index)).post(
  upload.single("listing[image]"),
  // (req, res) => {
  //   res.send(req.file);
  // });
  WrapAsync(postt)
);

Router.post("/listing/search/", WrapAsync(search));

Router.get("/listings/:id", WrapAsync(showw));

Router.get("/listing/new", isLogged, neww);

Router.get("/listings/:id/edit", isLogged, WrapAsync(editt));

Router.patch(
  "/listings/:id",
  upload.single("listing[img]"),
  // (req, res) => {
  //   res.send(req.file);
  // });
  WrapAsync(patchh)
);

Router.delete("/listings/:id/delete", isLogged, deletelistings);

module.exports = Router;
