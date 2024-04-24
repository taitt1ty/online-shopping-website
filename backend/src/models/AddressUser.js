"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AddressUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  AddressUser.init(
    {
      userId: DataTypes.INTEGER,
      shipName: DataTypes.STRING,
      shipAddress: DataTypes.STRING,
      shipEmail: DataTypes.STRING,
      shipPhoneNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AddressUser",
      tableName: "address_users",
    }
  );
  return AddressUser;
};
