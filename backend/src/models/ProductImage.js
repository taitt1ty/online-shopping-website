"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductImage.belongsTo(models.ProductDetail, {
        foreignKey: "productDetailId",
        targetKey: "id",
        as: "productImageData",
      });
    }
  }
  ProductImage.init(
    {
      productDetailId: DataTypes.INTEGER,
      image: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "ProductImage",
      tableName: "product_images",
    }
  );
  return ProductImage;
};
