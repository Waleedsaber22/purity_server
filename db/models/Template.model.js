const { DataTypes } = require("sequelize");

const Template = (sequelize) => {
  const Template = sequelize.define(
    "Template",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      }
    },
    {
      tableName: "Template",
      timestamps: true,
    }
  );
  return {
    model: Template,
    relations: () => {},
  };
};

module.exports = Template;
