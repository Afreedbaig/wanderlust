const listing = require("../models/listing");
const { cloudinary } = require("../cloudconfig");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  // let samplelist = new listing({
  //     title:"My New Villa",
  //     descripition : "By the beach",
  //     price : 1200,
  //     location : "kolkata , WB",
  //     country :"India"
  // })
  // await samplelist.save()
  // res.send("Doneee.....")
  // data = await listing.find();
  // console.log("No of listings :", data.length);
  // res.render("listings/index.ejs");

  //

  data = await listing.find();
  // for (dataa of data) {
  //   let cord = await geocodingClient
  //     .forwardGeocode({
  //       query: dataa.location,
  //       limit: 1,
  //     })
  //     .send();

  //   await listing.findByIdAndUpdate(dataa._id, {
  //     geometry: cord.body.features[0].geometry,
  //   });
  // }
  console.log("No of listings :", data.length);
  res.render("listings/index.ejs");
};

module.exports.neww = (req, res) => {
  return res.render("listings/new.ejs");
};

module.exports.postt = async (req, res) => {
  // listingSchema.validate(req.body);
  // console.log(result);
  // if (result.error) {
  //     throw new ExpressError(400,result.error)
  // }
  // let New = new listing({
  // title: data.title,
  // description:
  //     data.description,
  // image: {
  //     filename: "listingimage",
  //     url: "",
  // },
  // price: data.price,
  // location: data.location,
  // country: data.country,
  // })
  // await New.save().then(console.log("ok"))
  // Easy method

  data = req.body.listing;
  let cord = await geocodingClient
    .forwardGeocode({
      query: data.location,
      limit: 1,
    })
    .send();
  data.geometry = cord.body.features[0].geometry;
  data.owner = `${req.user.username}`;
  data.image = { url: `${req.file.path}`, filename: `${req.file.filename}` };
  console.log(data);
  await new listing(data).save().then(() => {
    console.log("okok");
  });
  req.flash("success", "New Listing Created");
  res.redirect("/listing");
};

module.exports.editt = async (req, res) => {
  id = req.params;
  data = await listing.findById(`${id.id}`);
  if (!data) {
    req.flash("error", "Listing U requested for does not exist!");
    res.redirect("/listing");
  }
  res.render("listings/edit.ejs");
};

module.exports.showw = async (req, res) => {
  let username = "user";
  if (req.user) {
    username = req.user.username;
  }
  id = req.params;
  data = await listing.findById(`${id.id}`).populate("reviews");
  // console.log(data.reviews.length);
  if (!data) {
    req.flash("error", "Listing U requested for does not exist!");
    return res.redirect("/listing");
  }
  res.render("listings/show.ejs", { username });
};

module.exports.patchh = async (req, res) => {
  id = req.params;
  // console.log(req.body.listing)
  let data = req.body.listing;
  console.log(req.file);
  if (Boolean(req.file)) {
    data.image = { url: `${req.file.path}`, filename: `${req.file.filename}` };
    await listing.findByIdAndUpdate(`${id.id}`, data).then(() => {
      console.log("hiii");
    });
  } else {
    data1 = await listing.findById(`${id.id}`);
    data.image = data1.image;
    await listing.findByIdAndUpdate(`${id.id}`, data);
  }
  req.flash("success", " Listing Updated ");
  res.redirect(`/listings/${id.id}`);
};

module.exports.deletelistings = async (req, res) => {
  id = req.params;
  let A = await listing.findById(`${id.id}`);
  if (A.image.filename) {
    cloudinary.uploader.destroy(A.image.filename);
  }
  await listing.findByIdAndDelete(`${id.id}`);
  req.flash("success", " Listing Deleted");
  res.redirect("/listing");
};

module.exports.search = async (req, res) => {
  let { data } = req.body;
  let titlesdata = await listing.find();
  let titles = [];
  for (i of titlesdata) {
    titles.push(i.title);
  }
  for (i of titles) {
    if (i.toUpperCase() == data.toUpperCase()) {
      let found = await listing.findOne({ title: i });
      let id = found._id;
      return res.redirect(`/listings/${id}`);
    }
  }
  req.flash("error", "listing with that title does not exists!!");
  // console.log(titles);
  // console.log(data.toUpperCase());
  return res.redirect("/listing");
};
