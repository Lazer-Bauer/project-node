const router = require("express").Router();
const { authorize } = require("../middleWare/authUsers");
const {
  Card,
  validateCard,
  generateBizNumber,
} = require("../models/cards.models");

router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.get("/my-cards", authorize, async (req, res) => {
  try {
    const users = await Card.find({ user_id: req.user._id });
    res.json(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.get("/:id", async (req, res) => {
  const paramsId = req.params.id;

  const card = await Card.findOne({
    _id: paramsId,
  });

  if (!card) {
    res.status(400).send("The card with the given ID was not found");
    return;
  }

  res.json(card);
});
router.post("/", authorize, async (req, res) => {
  if (!req.user.isBusiness) {
    console.log(req.user.isBusiness);
    return res
      .status(403)
      .send("Access denied. Only business user can create cards.");
  }
  // validate user's input
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // process
  try {
    const card = new Card({
      ...req.body,
      image: {
        url:
          req.body.image.url ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        alt: req.body.image.url || "Default image",
      },
      user_id: req.user._id,
    });

    await card.save();

    // response
    res.json(card);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.put("/:id", authorize, async (req, res) => {
  // validate user's input
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const paramsId = req.params.id;
  try {
    // validate system & process/
    const card = await Card.findOneAndUpdate(
      {
        user_id: req.user._id,
        _id: paramsId,
      },
      req.body,
      { new: true }
    );

    if (!card) {
      res
        .status(400)
        .send(
          "The card with the given ID was not found or you are not its owner"
        );
      return;
    }

    // response
    res.json(card);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.patch("/:id", authorize, async (req, res) => {
  try {
    const paramsId = req.params.id;

    // Find the Card by ID
    const card = await Card.findById(paramsId);

    if (!card) {
      res.status(404).send("The card with the given ID was not found");
      return;
    }

    const isLiked = card.likes.includes(req.user._id);

    if (isLiked) {
      card.likes.pull(req.user._id);
    } else {
      card.likes.push(req.user._id);
    }

    await card.save();

    res.json(card);
  } catch (error) {
    // Handle database or other errors

    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", authorize, async (req, res) => {
  const paramsId = req.params.id;
  const card = await Card.findById(paramsId);
  if (!card) {
    res.status(400).send("The card with the given ID was not found");
    return;
  }

  if (
    req.user._id.toString() !== card.user_id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403).send("You need to be the register or admin");
    return;
  }
  const deleteCard = await Card.findOneAndDelete({
    _id: paramsId,
  });

  res.json(deleteCard);
});

module.exports = router;
