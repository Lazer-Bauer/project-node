const ENVIRONMENT = process.env.NODE_ENV;

const connectToDb = () => {
  if (ENVIRONMENT === "development") require("./mongoDb/connectLocaly");
  if (ENVIRONMENT === "production") require("./mongoDb/connectAtlas");
};

module.exports = connectToDb;
