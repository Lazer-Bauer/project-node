const router = require("express").Router();
const { User } = require("../models/users.models");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { Security } = require("../models/blockUser");

router.post("/", async (req, res) => {
  // Validate user's input
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    // Validate system
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("Invalid email or password");
      return;
    }

    // Check if user is temporarily blocked
    const loginAttempt = await Security.findOne({ email: req.body.email });

    if (
      loginAttempt &&
      loginAttempt.timeStamp.attempts >= 3 &&
      Date.now() - loginAttempt.timeStamp.date < 24 * 60 * 60 * 1000
    ) {
      res
        .status(403)
        .send("User is temporarily blocked. Please try again later.");
      return;
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(loginAttempt, "start");
    if (!validPassword) {
      // Increment login attempts for the user
      if (!loginAttempt) {
        const failedFlag = new Security({
          email: req.body.email,
          timeStamp: { attempts: 1, date: Date.now() },
        });
        await failedFlag.save();
      } else {
        loginAttempt.timeStamp.attempts++;
        await loginAttempt.save();
      }

      res.status(400).send("Invalid email or password");

      return;
    }
    console.log(loginAttempt, "end");
    // If login successful, reset login attempts for the user
    await Security.deleteOne({ email: req.body.email });

    // Process successful login
    const token = user.generateAuthToken();
    // Response
    res.json({ token });
  } catch (err) {
    res.status(500).send(err);
  }
});

function validateLogin(user) {
  const schema = Joi.object({
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
  }).required();
  return schema.validate(user);
}
module.exports = router;

// jwt.sign(
//   { _id: user._id, isBusiness: user.isBusiness, isAdmin: user.isAdmin },
//   process.env.JWT_SECRET,
//   {
//     expiresIn: "1h",
//   }
// ); // Set expiration time to 1 hour
