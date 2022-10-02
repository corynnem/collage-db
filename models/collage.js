const DataTypes = require("sequelize");
const db = require("../db");

const Collage = db.define("collage", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photoLink: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
});

module.exports = Collage;
