const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const cardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  subtitle: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
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
  web: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
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
    zip: {
      type: Number,
      required: true,
      minlength: 2,
      maxlength: 1024,
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
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  bizNumber: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  likes: [
    {
      type: String,
    },
  ],
});
cardsSchema.pre("save", async function (next) {
  if (!this.bizNumber) {
    this.bizNumber = await generateBizNumber();
  }
  next();
});
const Card = mongoose.model("Card", cardsSchema, "cards");
Card.findOne({ bizNumber: 200 }).populate("user_id");
function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    subtitle: Joi.string().max(255).required(),
    description: Joi.string().min(2).max(255).required(),
    phone: Joi.string().min(10).max(15).required(),
    web: Joi.string().min(8).max(1024).required(),
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email({ tlds: { allow: false } }),
    image: {
      url: Joi.string().uri().min(2).max(1024).allow(""),
      alt: Joi.string().min(2).max(20).allow(""),
    },

    address: {
      country: Joi.string().min(2).max(20).required(),
      city: Joi.string().min(2).max(20).required(),
      street: Joi.string().min(2).max(20).required(),
      houseNumber: Joi.number().min(2).max(20).required(),
      zip: Joi.number().min(2).max(1024).required(),
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  }).required();
  return schema.validate(card);
}
async function generateBizNumber() {
  while (true) {
    const randomNumber = _.random(100, 999_999_999_999);
    const card = await Card.findOne({ bizNumber: randomNumber });
    if (!card) {
      return String(randomNumber);
    }
  }
}
module.exports = {
  Card,
  validateCard,
  generateBizNumber,
};
