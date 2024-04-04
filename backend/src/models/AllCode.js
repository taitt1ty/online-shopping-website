"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AllCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AllCode.hasMany(models.User, { foreignKey: "roleId", as: "roleData" });
    }
  }
  AllCode.init(
    {
      type: DataTypes.STRING,
      value: DataTypes.STRING,
      code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AllCode",
      tableName: "all_codes",
    }
  );
  return AllCode;
};
