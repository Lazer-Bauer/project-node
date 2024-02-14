const mongoose = require("mongoose");

const blockUserSchema = new mongoose.Schema({
  timeStamp: {
    attempts: {
      type: Number,
    },
    date: {
      type: Date,
    },
  },
  email: {
    type: String,
  },
});
const Security = mongoose.model("Security", blockUserSchema, "blocked");
module.exports = {
  Security,
};
