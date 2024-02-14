const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv/config");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(chalk.magentaBright("connected to MongoDb Locally!")))
  .catch((error) =>
    console.log(chalk.redBright.bold(`could not connect to mongoDb: ${error}`))
  );
