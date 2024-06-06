const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocatmongoose = require("passport-local-mongoose");

let User = new Schema({
  email: {
    type: String,
    required: true,
  },
});

User.plugin(passportlocatmongoose);

module.exports = mongoose.model("User", User);
