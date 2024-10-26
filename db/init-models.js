const fs = require("fs");
const path = require("path");

const modelPath = path.join(process.cwd(), "db", "models");
const initModels = (sequelize, initRelations = false) => {
  const models = {};
  const files = fs.readdirSync(modelPath);
  const allRelations = [];
  for (const file of files) {
    const model = require(path.join(modelPath, file))(sequelize);
    models[file?.split(".")?.[0]] = model.model;
    if (model.relations) allRelations.push(model.relations);
  }
  for (const relations of allRelations) relations();
  return models;
};

module.exports = initModels;
