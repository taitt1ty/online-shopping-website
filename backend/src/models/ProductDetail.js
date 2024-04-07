"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductDetail.belongsTo(models.Product, {
        foreignKey: "productId",
        targetKey: "id",
        as: "productDetailData",
      });
      ProductDetail.hasMany(models.ProductImage, {
        foreignKey: "productDetailId",
        as: "productImageData",
      });
    }
  }
  ProductDetail.init(
    {
      productId: DataTypes.INTEGER,
      color: DataTypes.STRING,
      originalPrice: DataTypes.BIGINT,
      discountPrice: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "ProductDetail",
      tableName: "product_details",
    }
  );
  return ProductDetail;
};
