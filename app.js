require("dotenv/config");
const mongoose = require("mongoose");
const chalk = require("chalk");
const connection = require("./dbServices");
const cors = require("cors");
const path = require("path");
connection();
const { checkFirstRun } = require("./initialData/initialData");
checkFirstRun();
const enableAllCorsRequests = cors();

const express = require("express");
const morgan = require("morgan");
const { User } = require("./models/users.models");

const loginAttempts = new Map();
console.log(loginAttempts);

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(enableAllCorsRequests);

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/users/login", require("./routes/user.auth"));
app.use("/api/users/:id", require("./routes/user.routes"));
app.use("/api/cards", require("./routes/card.routes"));
app.use("/api/cards/my-cards", require("./routes/card.routes"));
app.use("/api/cards/:id", require("./routes/card.routes"));

app.use("*", (req, res) => {
  const filePath = path.resolve(__dirname, "./public/noSuchRoute.html");

  console.log(req.path);
  return res.status(404).sendFile(filePath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(chalk.blue(`listening to port ${PORT}`)));

console.log(chalk.red("Hello world!"));
//https://github.com/yehonatan604/BCard/blob/main/.env.example
