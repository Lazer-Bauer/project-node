const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    middle: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 255,
    },
    last: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  isBusiness: {
    type: Boolean,
    required: true,
  },
  address: {
    state: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 20,
    },
    country: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    city: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    street: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    houseNumber: {
      type: Number,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
  },
  image: {
    url: {
      type: String,
      required: false,

      maxlength: 1024,
    },
    alt: {
      type: String,
      required: false,

      maxlength: 20,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isBusiness: this.isBusiness, isAdmin: this.isAdmin },
    process.env.JWT_SECRET
  );
};
const User = mongoose.model("User", userSchema, "users");
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(255).required(),
      middle: Joi.string().allow("", null).max(255).optional(),
      last: Joi.string().min(2).max(255).required(),
    }),
    phone: Joi.string().min(10).max(15).required(),
    image: {
      url: Joi.string().uri().max(1024).allow(""),
      alt: Joi.string().max(20).allow(""),
    },
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string()
      .min(8)
      .max(1024)
      .required()
      .pattern(new RegExp("(?=.[0-9])"))
      .pattern(new RegExp("(?=.*[A-Z])"))
      .pattern(new RegExp("(?=.*[a-z])"))
      .pattern(new RegExp("[!@#$%^&]")),
    address: {
      country: Joi.string().min(2).max(20).required(),
      city: Joi.string().min(2).max(20).required(),
      street: Joi.string().min(2).max(20).required(),
      houseNumber: Joi.number().min(2).max(20).required(),
    },
    isBusiness: Joi.boolean(),
    isAdmin: Joi.boolean(),
  }).required();
  return schema.validate(user);
}

module.exports = {
  User,
  validateUser,
};
