const { Sequelize, Op } = require("sequelize");
const initModels = require("./init-models");
const fs = require("fs");
const config = require("./config");
require("dotenv").config();

const sequelize = new Sequelize({
  ...config,
  logging: console.log,
  ssl: null,
  host: process.env.DATABASE_HOST,
  dialect: "postgres",
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
  port: process.env.DATABASE_PORT,
  operatorsAliases: {
    $gt: Op.gt, // Greater Than
    $gte: Op.gte, // Greater Than or Equal
    $lt: Op.lt, // Less Than
    $lte: Op.lte, // Less Than or Equal
    $between: Op.between, // Between
    $not: Op.not,
    $is: Op.is,
    $or: Op.or,
    $and: Op.and,
    $ne: Op.ne,
    $eq: Op.eq,
    $col: Op.col,
    $notBetween: Op.notBetween,
    $all: Op.all,
    $in: Op.in,
    $notIn: Op.notIn,
    $like: Op.like,
    $iLike: Op.iLike, // Not Working With SqlServer Database
    $notLike: Op.notLike,
    $notILike: Op.notILike, // Not Working With SqlServer Database
    $startsWith: Op.startsWith,
    $endsWith: Op.endsWith,
    $includes: Op.substring,
    $substring: Op.substring,
    $regexp: Op.regexp, // Not Working With SqlServer Database
    $notRegexp: Op.notRegexp, // Not Working With SqlServer Database
    $iRegexp: Op.iRegexp, // Not Working With SqlServer Database
    $notIRegexp: Op.notIRegexp, // Not Working With SqlServer Database
    $any: Op.any,
  },
  dialectOptions: {
    multipleStatements: true,
  },
});
const models = sequelize.models;
const connect = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query("SET session_replication_role='replica'");
    initModels(sequelize);
    await sequelize.sync();
    await sequelize.query("SET session_replication_role='origin'");
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = sequelize;
module.exports.db = { connect, models };
