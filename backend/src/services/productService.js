import db from "../models/index";
import jsrecommender from "js-recommender";
require("dotenv").config();
const { Op } = require("sequelize");
import {
  successResponse,
  errorResponse,
  missingRequiredParams,
  notFound,
} from "../utils/ResponseUtils";
import { notification } from "paypal-rest-sdk";

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

function dynamicSortMultiple() {
  var props = arguments;
  return function (obj1, obj2) {
    var i = 0,
      result = 0,
      numberOfProperties = props.length;
    /* try getting a different result from 0 (equal)
     * as long as we have extra properties to compare
     */
    while (result === 0 && i < numberOfProperties) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  };
}

// PRODUCT
const createProduct = async (data) => {
  try {
    // Check for missing required parameters
    if (!data.categoryId || !data.brandId) {
      return missingRequiredParams("Category, Brand are");
    }
    // Create product
    const product = await db.Product.create({
      name: data.name,
      content: data.content,
      statusId: "S1",
      categoryId: data.categoryId,
      brandId: data.brandId,
    });
    // Check if product creation was successful
    if (!product) {
      return errorResponse(error.message);
    }
    // Create product detail
    const productDetail = await db.ProductDetail.create({
      productId: product.id,
      color: data.color,
      originalPrice: data.originalPrice,
      discountPrice: data.discountPrice,
    });
    // Check if product detail creation was successful
    if (!productDetail) {
      return errorResponse(error.message);
    }
    // Create product image
    await db.ProductImage.create({
      productDetailId: productDetail.id,
      image: data.image,
    });
    // Create product detail size
    await db.ProductSize.create({
      productDetailId: productDetail.id,
      height: data.height,
      weight: data.weight,
      sizeId: data.sizeId,
    });
    return successResponse("Product created");
  } catch (error) {
    console.error("Error creating product:", error);
    return errorResponse(error.message);
  }
};

const getAllProductAdmin = async (data) => {
  try {
    let objectFilter = {
      include: [
        { model: db.AllCode, as: "brandData", attributes: ["value", "code"] },
        {
          model: db.AllCode,
          as: "categoryData",
          attributes: ["value", "code"],
        },
        { model: db.AllCode, as: "statusData", attributes: ["value", "code"] },
      ],
      raw: true,
      nest: true,
    };
    if (data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }
    if (data.categoryId && data.categoryId !== "ALL") {
      objectFilter.where = { categoryId: data.categoryId };
    }
    if (data.brandId && data.brandId !== "ALL") {
      objectFilter.where = { ...objectFilter.where, brandId: data.brandId };
    }
    if (data.sortName === "true") {
      objectFilter.order = [["name", "ASC"]];
    }
    if (data.keyword && data.keyword !== "") {
      objectFilter.where = {
        ...objectFilter.where,
        name: { [Op.substring]: data.keyword },
      };
    }
    let res = await db.Product.findAndCountAll(objectFilter);
    if (data.sortPrice && data.sortPrice === "true") {
      res.rows.sort(dynamicSortMultiple("price"));
    }
    return {
      result: [res.rows],
      statusCode: 200,
      errors: ["Get all products successfully!"],
    };
  } catch (error) {
    console.error("Error get all products:", error);
    return errorResponse(error.message);
  }
};

const getAllProductUser = async (data) => {
  try {
    let objectFilter = {
      where: { statusId: "S1" },
      include: [
        { model: db.AllCode, as: "brandData", attributes: ["value", "code"] },
        {
          model: db.AllCode,
          as: "categoryData",
          attributes: ["value", "code"],
        },
        { model: db.AllCode, as: "statusData", attributes: ["value", "code"] },
      ],
      raw: true,
      nest: true,
    };
    if (data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }
    if (data.categoryId && data.categoryId !== "ALL") {
      objectFilter.where = { categoryId: data.categoryId };
    }
    if (data.brandId && data.brandId !== "ALL") {
      objectFilter.where = { ...objectFilter.where, brandId: data.brandId };
    }
    if (data.sortName === "true") {
      objectFilter.order = [["name", "ASC"]];
    }
    if (data.keyword && data.keyword !== "") {
      objectFilter.where = {
        ...objectFilter.where,
        name: { [Op.substring]: data.keyword },
      };
    }
    let res = await db.Product.findAndCountAll(objectFilter);
    if (data.sortPrice && data.sortPrice === "true") {
      res.rows.sort(dynamicSortMultiple("price"));
    }
    return {
      result: [res.rows],
      statusCode: 200,
      errors: ["Get all products successfully!"],
    };
  } catch (error) {
    console.error("Error get all products:", error);
    return errorResponse(error.message);
  }
};

const getProductById = async (id) => {
  try {
    if (!id) {
      return missingRequiredParams("id is");
    }
    // Fetch product with associated data
    const product = await db.Product.findOne({
      where: { id: id },
      include: [
        { model: db.AllCode, as: "brandData", attributes: ["value", "code"] },
        {
          model: db.AllCode,
          as: "categoryData",
          attributes: ["value", "code"],
        },
        { model: db.AllCode, as: "statusData", attributes: ["value", "code"] },
      ],
      raw: true,
      nest: true,
    });
    // If product not found, return error
    if (!product) {
      return notFound("Product");
    }
    // Increment the view count
    product.view++;
    await db.Product.update({ view: product.view }, { where: { id: id } });
    // Fetch product details
    let productDetail = await db.ProductDetail.findAll({
      where: { productId: product.id },
    });
    // Calculate and update stock for each product detail
    for (let i = 0; i < productDetail.length; i++) {
      let productImages = await db.ProductImage.findAll({
        where: { productDetailId: productDetail[i].id },
      });
      let productImageUrls = [];
      for (let j = 0; j < productImages.length; j++) {
        productImageUrls.push(productImages[j].imageUrl);
      }
      let productSizes = await db.ProductSize.findAll({
        where: { productDetailId: productDetail[i].id },
        include: [
          { model: db.AllCode, as: "sizeData", attributes: ["value", "code"] },
        ],
        raw: true,
        nest: true,
      });
      for (let k = 0; k < productSizes.length; k++) {
        let receiptDetails = await db.ReceiptDetail.findAll({
          where: { sizeId: productSizes[k].id },
        });
        let orderDetails = await db.OrderDetail.findAll({
          where: { productId: productSizes[k].id },
        });
        let quantity = 0;
        for (let g = 0; g < receiptDetails.length; g++) {
          quantity += receiptDetails[g].quantity;
        }
        for (let h = 0; h < orderDetails.length; h++) {
          let order = await db.Order.findOne({
            where: { id: orderDetails[h].orderId },
          });
          if (order.statusId != "S7") {
            quantity -= orderDetails[h].quantity;
          }
        }
        productSizes[k].stock = quantity;
      }
      productDetail[i].productImage = productImages;
      productDetail[i].productSize = productSizes;
    }
    return {
      result: [product],
      statusCode: 200,
      errors: [`Get product with id = ${id} successfully!`],
    };
  } catch (error) {
    console.error("Error retrieving product details:", error);
    return errorResponse(error.message);
  }
};

const inActiveProduct = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("id is");
    }
    let product = await db.Product.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (!product) {
      return notFound("Product");
    }
    product.statusId = "S2";
    await product.save();
    return successResponse(`Product with id = ${data.id} deactivated`);
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

const activeProduct = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("id is");
    }
    let product = await db.Product.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (!product) {
      return notFound("Product");
    }
    product.statusId = "S1";
    await product.save();
    return successResponse(`Product with id = ${data.id} activated`);
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

const updateProduct = async (data) => {
  try {
    if (!data.id || !data.categoryId || !data.brandId) {
      return missingRequiredParams("id, category, brand are");
    }
    let product = await db.Product.findOne({ where: { id: data.id } });
    if (!product) {
      return notFound("Product");
    }
    await db.Product.update(
      {
        name: data.name,
        brandId: data.brandId,
        categoryId: data.categoryId,
        content: data.content,
      },
      {
        where: { id: data.id },
      }
    );
    return successResponse("Product updated");
  } catch (error) {
    console.error("Error updating product:", error);
    return errorResponse(error.message);
  }
};

// PRODUCT DETAIL
const createProductDetail = async (data) => {
  try {
    if (
      !data.color ||
      !data.originalPrice ||
      !data.discountPrice ||
      !data.productId
    ) {
      return missingRequiredParams(
        "color, originalPrice, discountPrice, product are"
      );
    }
    const productDetail = await db.ProductDetail.create({
      productId: data.productId,
      color: data.color,
      originalPrice: data.originalPrice,
      discountPrice: data.discountPrice,
    });
    if (!productDetail) {
      return errorResponse("Failed to create new product detail");
    }
    return successResponse("Created new product detail");
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const getAllProductDetail = async (data) => {
  try {
    if (!data || !data.id || !data.limit || !data.offset) {
      return missingRequiredParams("id, limit, offset are");
    }
    const { id, limit, offset } = data;
    const objectFilter = {
      include: [
        { model: db.ProductImage, as: "productImageData" },
        { model: db.ProductSize, as: "sizeData" },
      ],
      where: { productId: id },
      limit: +limit,
      offset: +offset,
      raw: true,
    };
    const productDetails = await db.ProductDetail.findAndCountAll(objectFilter);
    // Check if product details are found
    if (!productDetails.rows.length) {
      return notFound("Product details");
    }
    return {
      result: [productDetails.rows],
      statusCode: 200,
      errors: ["Get all product details successfully!"],
    };
  } catch (error) {
    console.error("Error retrieving product details:", error);
    return errorResponse(error.message);
  }
};

const getProductDetailById = async (id) => {
  try {
    if (!id) {
      return missingRequiredParams("id is");
    }
    let productDetail = await db.ProductDetail.findOne({
      where: { id: id },
    });
    if (!productDetail) {
      return notFound("Product detail");
    }
    return {
      result: [productDetail],
      statusCode: 200,
      errors: [`Get product detail with id = ${id} successfully!`],
    };
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

const updateProductDetail = async (data) => {
  try {
    if (!data.originalPrice || !data.discountPrice || !data.id) {
      return missingRequiredParams("originalPrice, discountPrice, id are");
    }
    let productDetail = await db.ProductDetail.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (!productDetail) {
      return notFound("Product detail");
    }
    if (
      (productDetail.originalPrice === data.originalPrice &&
        productDetail.discountPrice === data.discountPrice) ||
      productDetail.color === data.color
    ) {
      return {
        result: [],
        statusCode: 200,
        errors: ["No changes detected. Product detail not updated."],
      };
    }
    productDetail.originalPrice = data.originalPrice;
    productDetail.discountPrice = data.discountPrice;
    productDetail.color = data.color;
    await productDetail.save();

    return {
      result: productDetail,
      statusCode: 200,
      errors: ["Product detail updated successfully"],
    };
  } catch (error) {
    console.error("Error updating product detail:", error);
    return errorResponse("Failed to update product detail");
  }
};

const deleteProductDetail = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("id is");
    }
    let productDetail = await db.ProductDetail.findOne({
      where: { id: data.id },
    });
    if (productDetail) {
      await db.ProductDetail.destroy({
        where: { id: data.id },
      });
      let productImg = await db.ProductImage.findOne({
        where: { productDetailId: data.id },
      });
      if (productImg) {
        await db.ProductImage.destroy({
          where: { productDetailId: data.id },
        });
      }
      return successResponse("Product detail deleted");
    } else {
      return notValid(error.message);
    }
  } catch (error) {
    return errorResponse(error.message);
  }
};

// PRODUCT IMAGE
const createProductImage = async (data) => {
  try {
    if (!data.image || !data.productDetailId) {
      return missingRequiredParams("image, productDetail are");
    }
    const productImage = await db.ProductImage.create({
      productDetailId: data.productDetailId,
      image: data.image,
    });
    return successResponse("Created new product image");
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const getAllProductImage = async (data) => {
  try {
    if (!data.id || !data.limit || !data.offset) {
      return missingRequiredParams("id, limit, or offset are");
    }
    let productImage = await db.ProductImage.findAndCountAll({
      where: { productDetailId: data.id },
      limit: +data.limit,
      offset: +data.offset,
    });
    if (!productImage.rows || productImage.rows.length === 0) {
      return notFound("Product image");
    }
    return {
      result: [productImage],
      statusCode: 200,
      errors: ["Get all product images successfully"],
    };
  } catch (error) {
    console.error("Error get all product images", error);
    return errorResponse(error.message);
  }
};

const getProductImageById = async (id) => {
  try {
    if (!id) {
      return missingRequiredParams("id");
    }
    let productDetailImage = await db.ProductImage.findOne({
      where: { id: id },
    });
    if (!productDetailImage) {
      return notFound("Product image");
    }
    return {
      result: [productDetailImage],
      statusCode: 200,
      errors: [`Get product image with id = ${id} successfully`],
    };
  } catch (error) {
    console.error("Error retrieving product detail image", error);
    return errorResponse(error.message);
  }
};

const updateProductImage = async (data) => {
  try {
    if (!data.id || !data.image) {
      return missingRequiredParams("id or image");
    }
    let productImage = await db.ProductImage.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (!productImage) {
      return notFound("product image");
    }
    productImage.image = data.image;
    await productImage.save();
    return successResponse(`Updated product image ${id}`);
  } catch (error) {
    console.error("Error updating product image:", error);
    return errorResponse(error.message);
  }
};

const deleteProductImage = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("id");
    }
    let productImage = await db.ProductImage.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (productImage) {
      await db.ProductImage.destroy({
        where: { id: data.id },
      });
      return successResponse("Deleted product image");
    } else {
      return notFound("Product image");
    }
  } catch (error) {
    return errorResponse(error.message);
  }
};

// PRODUCT SIZE
const createProductSize = async (data) => {
  try {
    if (!data.productDetailId || !data.sizeId) {
      return missingRequiredParams("Product detail, size are");
    } else {
      await db.ProductSize.create({
        productDetailId: data.productDetailId,
        sizeId: data.sizeId,
        height: data.height,
        weight: data.weight,
      });
      return successResponse("Product detail size created");
    }
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const getAllProductSize = async (data) => {
  try {
    const { id, limit, offset } = data;
    if (!id || !limit || !offset) {
      return missingRequiredParams("id, limit, offset are");
    }
    const productSize = await db.ProductSize.findAndCountAll({
      where: { productDetailId: id },
      limit: +limit,
      offset: +offset,
      include: [
        { model: db.AllCode, as: "sizeData", attributes: ["value", "code"] },
      ],
      raw: true,
      nest: true,
    });
    for (let i = 0; i < productSize.rows.length; i++) {
      const receiptDetail = await db.ReceiptDetail.findAll({
        where: { sizeId: productSize.rows[i].id },
      });
      const orderDetail = await db.OrderDetail.findAll({
        where: { productId: productSize.rows[i].id },
      });
      let quantity = 0;
      for (let j = 0; j < receiptDetail.length; j++) {
        quantity += receiptDetail[j].quantity;
      }
      for (let k = 0; k < orderDetail.length; k++) {
        const order = await db.Order.findOne({
          where: { id: orderDetail[k].orderId },
        });
        if (order.statusId != "S7") {
          quantity -= orderDetail[k].quantity;
        }
      }
      productSize.rows[i].stock = quantity;
    }
    return {
      result: [productSize.rows],
      statusCode: 200,
      errors: ["Get all product sizes successfully!"],
    };
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const getProductSizeById = async (id) => {
  try {
    if (!id) {
      return missingRequiredParams("id");
    } else {
      const productSize = await db.ProductSize.findOne({
        where: { id: id },
      });
      if (!productSize) {
        return notFound("Product size");
      }
      return {
        result: [productSize],
        statusCode: 200,
        errors: [`Get product size ${id} successfully!`],
      };
    }
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const updateProductSize = async (data) => {
  try {
    if (!data.id || !data.sizeId) {
      return missingRequiredParams("id, size are");
    } else {
      let productSize = await db.ProductSize.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (!productSize) {
        return notFound("Product size");
      }
      productSize.sizeId = data.sizeId;
      productSize.height = data.height;
      productSize.weight = data.weight;
      await productSize.save();
      return successResponse("Product size updated");
    }
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const deleteProductSize = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("id");
    } else {
      let productSize = await db.ProductSize.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (!productSize) {
        return notFound("product size");
      }
      await productSize.destroy({
        where: { id: data.id },
      });
      return successResponse("Product size deleted");
    }
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

//Get a list of products based on views
const getProductFeature = async (limit) => {
  try {
    if (!limit || isNaN(limit)) {
      return errorResponse("Invalid or missing 'limit' parameter");
    }
    limit = +limit;
    let products = await db.Product.findAll({
      include: [
        { model: db.AllCode, as: "brandData", attributes: ["value", "code"] },
        {
          model: db.AllCode,
          as: "categoryData",
          attributes: ["value", "code"],
        },
        { model: db.AllCode, as: "statusData", attributes: ["value", "code"] },
      ],
      limit: limit,
      order: [["view", "DESC"]],
      raw: true,
      nest: true,
    });
    for (let i = 0; i < products.length; i++) {
      const productDetails = await db.ProductDetail.findAll({
        where: { productId: products[i].id },
        raw: true,
      });
      for (let j = 0; j < productDetails.length; j++) {
        const productSizes = await db.ProductSize.findAll({
          where: { productDetailId: productDetails[j].id },
          raw: true,
        });
        const productImages = await db.ProductImage.findAll({
          where: { productDetailId: productDetails[j].id },
          raw: true,
        });
        productDetails[j].productDetailSize = productSizes;
        productDetails[j].productImage = productImages;
        // Set price to the first product detail's discount price
        products[i].price = productDetails[0].discountPrice;
      }
      products[i].productDetail = productDetails;
    }
    return {
      result: [products],
      statusCode: 200,
      errors: ["Get product feature successfully!"],
    };
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

//Get a list of products based on create time (new products)
const getProductNew = async (limit) => {
  try {
    if (!limit || isNaN(limit)) {
      return errorResponse("Invalid or missing 'limit' parameter");
    }
    limit = +limit;
    let products = await db.Product.findAll({
      include: [
        { model: db.AllCode, as: "brandData", attributes: ["value", "code"] },
        {
          model: db.AllCode,
          as: "categoryData",
          attributes: ["value", "code"],
        },
        { model: db.AllCode, as: "statusData", attributes: ["value", "code"] },
      ],
      limit: limit,
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    });
    for (let i = 0; i < products.length; i++) {
      const productDetails = await db.ProductDetail.findAll({
        where: { productId: products[i].id },
        raw: true,
      });
      for (let j = 0; j < productDetails.length; j++) {
        const productSizes = await db.ProductSize.findAll({
          where: { productDetailId: productDetails[j].id },
          raw: true,
        });
        const productImages = await db.ProductImage.findAll({
          where: { productDetailId: productDetails[j].id },
          raw: true,
        });

        productDetails[j].productDetailSize = productSizes;
        productDetails[j].productImage = productImages;

        products[i].price = productDetails[0].discountPrice;
      }
      products[i].productDetail = productDetails;
    }
    return {
      result: products,
      statusCode: 200,
      errors: ["Get new product successfully!"],
    };
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const getProductShopCart = async (data) => {
  try {
    let productArr = [];
    if (!data.userId && !data.limit) {
      return missingRequiredParams("userId or limit");
    } else {
      let shopCart = await db.ShopCart.findAll({
        where: { userId: data.userId },
      });
      for (let i = 0; i < shopCart.length; i++) {
        let productDetail = await db.ProductDetail.findOne({
          where: { id: productSize.productDetailId },
        });
        let product = await db.Product.findOne({
          where: { id: productDetail.productId },
          include: [
            {
              model: db.AllCode,
              as: "brandData",
              attributes: ["value", "code"],
            },
            {
              model: db.AllCode,
              as: "categoryData",
              attributes: ["value", "code"],
            },
            {
              model: db.AllCode,
              as: "colorData",
              attributes: ["value", "code"],
            },
            {
              model: db.AllCode,
              as: "sizeData",
              attributes: ["value", "code"],
            },
            {
              model: db.AllCode,
              as: "statusData",
              attributes: ["value", "code"],
            },
          ],
          limit: +data.limit,
          order: [["view", "DESC"]],
          raw: true,
          nest: true,
        });

        productArr.push(product);
      }
      if (productArr && productArr.length > 0) {
        for (let g = 0; g < productArr.length; g++) {
          let objectFilterProductDetail = {
            where: { productId: productArr[g].id },
            raw: true,
          };
          productArr[g].productDetail = await db.ProductDetail.findAll(
            objectFilterProductDetail
          );
          for (let j = 0; j < productArr[g].productDetail.length; j++) {
            productArr[g].price = productArr[g].productDetail[0].discountPrice;
            productArr[g].productDetail[j].productImage =
              await db.ProductImage.findAll({
                where: { productDetailId: productArr[g].productDetail[j].id },
                raw: true,
              });
            for (
              let k = 0;
              k < productArr[g].productDetail[j].productImage.length > 0;
              k++
            ) {
              productArr[g].productDetail[j].productImage[k].image =
                Buffer.from(
                  productArr[g].productDetail[j].productImage[k].image,
                  "base64"
                ).toString("binary");
            }
          }
        }
      }
    }
    return {
      result: [productArr],
      statusCode: 200,
      errors: ["Get products from shop cart successfully!"],
    };
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

const getProductRecommend = async (data) => {
  try {
    let productArr = [];
    if (!data.userId && !data.limit) {
      return missingRequiredParams("userId or limit");
    } else {
      let recommender = new jsrecommender.Recommender();
      let table = new jsrecommender.Table();
      let rateList = await db.Comment.findAll({
        where: { star: { [Op.not]: null } },
      });
      for (let i = 0; i < rateList.length; i++) {
        table.setCell(
          rateList[i].productId,
          rateList[i].userId,
          rateList[i].star
        );
      }
      let model = recommender.fit(table);
      let predicted_table = recommender.transform(table);
      for (let i = 0; i < predicted_table.columnNames.length; ++i) {
        let user = predicted_table.columnNames[i];
        for (let j = 0; j < predicted_table.rowNames.length; ++j) {
          let product = predicted_table.rowNames[j];
          if (
            user == data.userId &&
            Math.round(predicted_table.getCell(product, user)) > 3
          ) {
            let productData = await db.Product.findOne({
              where: { id: product },
            });
            if (productArr.length == +data.limit) {
              break;
            } else {
              productArr.push(productData);
            }
          }
        }
      }
      if (productArr && productArr.length > 0) {
        for (let g = 0; g < productArr.length; g++) {
          let objectFilterProductDetail = {
            where: { productId: productArr[g].id },
            raw: true,
          };
          productArr[g].productDetail = await db.ProductDetail.findAll(
            objectFilterProductDetail
          );
          for (let j = 0; j < productArr[g].productDetail.length; j++) {
            productArr[g].price = productArr[g].productDetail[0].discountPrice;
            productArr[g].productDetail[j].productImage =
              await db.ProductImage.findAll({
                where: { productDetailId: productArr[g].productDetail[j].id },
                raw: true,
              });
            for (
              let k = 0;
              k < productArr[g].productDetail[j].productImage.length > 0;
              k++
            ) {
              productArr[g].productDetail[j].productImage[k].image =
                Buffer.from(
                  productArr[g].productDetail[j].productImage[k].image,
                  "base64"
                ).toString("binary");
            }
          }
        }
      }
    }
    return {
      result: [productArr],
      statusCode: 200,
      errors: ["Get recommended products successfully!"],
    };
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

export default {
  createProduct,
  getAllProductAdmin,
  getAllProductUser,
  inActiveProduct,
  activeProduct,
  getProductById,
  updateProduct,
  createProductDetail,
  getAllProductDetail,
  getProductDetailById,
  updateProductDetail,
  deleteProductDetail,
  createProductImage,
  getAllProductImage,
  getProductImageById,
  updateProductImage,
  deleteProductImage,
  createProductSize,
  getAllProductSize,
  getProductSizeById,
  updateProductSize,
  deleteProductSize,
  getProductFeature,
  getProductNew,
  getProductShopCart,
  getProductRecommend,
};
