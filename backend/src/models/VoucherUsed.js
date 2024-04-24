"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VoucherUsed extends Model {
    static associate(models) {}
  }
  // 0: unused
  // 1: used
  VoucherUsed.init(
    {
      voucherId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "VoucherUsed",
      tableName: "voucher_useds",
    }
  );
  return VoucherUsed;
};
