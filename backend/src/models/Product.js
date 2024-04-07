"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.AllCode, {
        foreignKey: "categoryId",
        targetKey: "code",
        as: "categoryData",
      });
      Product.belongsTo(models.AllCode, {
        foreignKey: "brandId",
        targetKey: "code",
        as: "brandData",
      }),
      Product.belongsTo(models.AllCode, {
        foreignKey: "statusId",
        targetKey: "code",
        as: "statusData",
      });
      Product.hasMany(models.ProductDetail, {
        foreignKey: "productId",
        as: "productDetailData",
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      content: DataTypes.TEXT("long"),
      statusId: DataTypes.STRING,
      categoryId: DataTypes.STRING,
      view: DataTypes.INTEGER,
      brandId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
