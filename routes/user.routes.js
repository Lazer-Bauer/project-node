const router = require("express").Router();
const { User, validateUser } = require("../models/users.models");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { authorize } = require("../middleWare/authUsers");
const { notFoundMiddleware } = require("../middleWare/authUsers");
router.post("/", async (req, res) => {
  try {
    // validate user's input
    const { error } = validateUser(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);

      return;
    }

    // validate system
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).send("User already registered");
      return;
    }

    // process
    const newUser = new User({
      ...req.body,
      image: {
        url:
          req.body.image.url ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        alt: req.body.image.url || "Default image",
      },

      password: await bcrypt.hash(req.body.password, 12),
    });
    await newUser.save();

    // response
    res.json(_.pick(newUser, ["id", "name", "email"]));
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/:id", authorize, async (req, res) => {
  const paramsId = req.params.id;

  if (req.user._id !== paramsId && !req.user.isAdmin) {
    res.status(403).send("You need to be the register or admin");
    return;
  }
  const user = await User.findOne({
    _id: paramsId,
  });

  if (!user) {
    res.status(400).send("The user with the given ID was not found");
    return;
  }

  res.json(user);
});

router.get("/", authorize, async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send("Access denied. Only admin  user can get all users.");
  }
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/:id", authorize, async (req, res) => {
  console.log(req.user);
  console.log(req.user.isAdmin);
  // validate user's input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const paramsId = req.params.id;
  if (req.user._id !== paramsId) {
    res.status(403).send("You need to be the register ");
    return;
  }
  try {
    if (!req.user.isAdmin) {
      delete req.body.isAdmin;
      delete req.body.isBusiness;
      delete req.body.password;
    }

    // validate system & process
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }
    const user = await User.findOneAndUpdate(
      {
        _id: paramsId,
      },
      req.body,

      { new: true }
    );

    if (!user) {
      res.status(400).send("The user with the given ID was not found");
      return;
    }
    // response

    req.user.isAdmin = user.isAdmin;
    res.json(user);
  } catch (err) {
    res.status(403).send(err);
  }
});

router.patch("/:id", authorize, async (req, res) => {
  try {
    // Validate user's input
    const { error } = validateUser(req.body, true); // Assume validateUser supports partial updates
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const paramsId = req.params.id;
    if (req.user._id !== paramsId) {
      res.status(403).send("You need to be the register ");
      return;
    }
    // Update the 'isBusiness' property
    const user = await User.findByIdAndUpdate(
      paramsId,
      { $set: { isBusiness: req.body.isBusiness } },
      { new: true }
    );

    if (!user) {
      res.status(404).send("The user with the given ID was not found");
      return;
    }

    // Respond with the updated user
    res.json(user);
  } catch (error) {
    // Handle database or other errors

    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", authorize, async (req, res) => {
  const paramsId = req.params.id;

  if (req.user._id !== paramsId && !req.user.isAdmin) {
    res.status(403).send("You need to be the register or admin");
    return;
  }
  const user = await User.findOneAndDelete({
    _id: req.params.id,
  });

  if (!user) {
    res.status(400).send("The user with the given ID was not found");
    return;
  }

  res.json(user);
});
module.exports = router;
// req.body.isAdmin == true ||
//         req.user.isBusiness !== req.body.isBusiness ||
//         !(await bcrypt.compare(req.body.password, user.password))
// res
// .status(403)
// .send(
//   "You are not permitted to change isAdmin or password ,please change isBusiness by patch method"
// );
