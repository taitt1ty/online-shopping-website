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
      return missingRequiredParams("categoryId or brandId");
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
      return errorResponse("Failed to create product");
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
      return errorResponse("Failed to create product detail");
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
    return errorResponse("Internal server error");
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
      result: {
        data: res.rows,
        count: res.count,
      },
      statusCode: 200,
      errors: "Products retrieved successfully!",
    };
  } catch (error) {
    console.error("Error retrieving products:", error);
    return errorResponse("Failed to retrieve products");
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
      result: {
        data: res.rows,
        count: res.count,
      },
      statusCode: 200,
      errors: "Products retrieved successfully!",
    };
  } catch (error) {
    console.error("Error retrieving products:", error);
    return errorResponse("Failed to retrieve products");
  }
};

const getProductById = async (id) => {
  try {
    // Kiểm tra đối số đầu vào
    if (!id) {
      return missingRequiredParams("id");
    }

    // Tìm kiếm sản phẩm
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
      raw: false, // Đặt raw: false để trả về đối tượng thực thể thay vì mảng
    });

    // Kiểm tra sản phẩm có tồn tại không
    if (!product) {
      return notFound("Product");
    }

    // Tăng số lượt xem của sản phẩm
    product.view += 1;
    const updatedProduct = await product.save();
    if (!updatedProduct) {
      return errorResponse("Failed to update product view count");
    }

    // Lấy thông tin chi tiết sản phẩm
    const productDetail = await db.ProductDetail.findAll({
      where: { productId: id },
      include: [
        { model: db.ProductImage, attributes: ["image"] },
        { model: db.ProductSize, attributes: ["height", "weight", "sizeId"] },
      ],
      raw: true,
      nest: true,
    });

    // Tính toán số lượng tồn kho cho từng chi tiết sản phẩm
    for (let i = 0; i < productDetail.length; i++) {
      let quantity = 0;

      // Lấy danh sách chi tiết phiếu nhập có id sản phẩm tương ứng
      const receiptDetails = await db.ReceiptDetail.findAll({
        where: { productDetailId: productDetail[i].id },
      });

      // Lấy danh sách chi tiết đơn đặt hàng có id sản phẩm tương ứng
      const orderDetails = await db.OrderDetail.findAll({
        where: { productId: productDetail[i].id },
      });

      // Tính tổng số lượng từ chi tiết phiếu nhập
      receiptDetails.forEach((receiptDetail) => {
        quantity += receiptDetail.quantity;
      });

      // Trừ số lượng đã bán từ chi tiết đơn đặt hàng
      orderDetails.forEach((orderDetail) => {
        if (orderDetail.statusId !== "S7") {
          quantity -= orderDetail.quantity;
        }
      });

      // Gán số lượng tồn kho cho chi tiết sản phẩm
      productDetail[i].stock = quantity;
    }

    // Thêm thông tin chi tiết sản phẩm vào đối tượng sản phẩm
    product.productDetail = productDetail;

    return {
      errorCode: 200,
      data: product,
    };
  } catch (error) {
    console.error("Error retrieving product details:", error);
    return errorResponse("Failed to retrieve product details");
  }
};

const unActiveProduct = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("id");
    }

    let product = await db.Product.findOne({
      where: { id: data.id },
      raw: false,
    });

    if (!product) {
      return errorResponse("The product doesn't exist");
    }

    product.statusId = "S2";
    await product.save();

    return successResponse("Product deactivated");
  } catch (error) {
    return errorResponse("Failed to deactivate product");
  }
};

const activeProduct = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("id");
    }

    let product = await db.Product.findOne({
      where: { id: data.id },
      raw: false,
    });

    if (!product) {
      return errorResponse("The product doesn't exist");
    }

    product.statusId = "S1";
    await product.save();

    return successResponse("Product activated");
  } catch (error) {
    return errorResponse("Failed to activate product");
  }
};

const updateProduct = async (data) => {
  try {
    if (!data.id || !data.categoryId || !data.brandId) {
      return missingRequiredParams("id, categoryId, or brandId");
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
    return errorResponse("Failed to update product");
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
      throw new Error(
        "color, originalPrice, discountPrice, or productId is missing"
      );
    }
    const productDetail = await db.ProductDetail.create({
      productId: data.productId,
      color: data.color,
      originalPrice: data.originalPrice,
      discountPrice: data.discountPrice,
    });
    if (!productDetail) {
      throw new Error("Failed to create new product detail");
    }
    return successResponse("Created new product detail");
  } catch (error) {
    console.error(error);
    return errorResponse(
      "Failed to create new product detail. Please check your input data."
    );
  }
};

const getAllProductDetail = async (data) => {
  try {
    // Check if required parameters are provided
    const { id, limit, offset } = data;
    if (!id || !limit || !offset) {
      return missingRequiredParams("id, limit, or offset");
    }

    // Find product details with pagination
    const productDetail = await db.ProductDetail.findAndCountAll({
      where: { productDetailId: data.id },
      limit: +data.limit,
      offset: +data.offset,
    });

    // Process product image data
    if (productDetail.rows && productDetail.rows.length > 0) {
      for (let i = 0; i < productDetail.rows.length; i++) {
        // Find product images for each product detail
        const productImages = await db.ProductImage.findAll({
          where: { productDetailId: productDetail.rows[i].id },
        });

        // Convert image data to binary
        if (productImages && productImages.length > 0) {
          productDetail.rows[i].productImageData = productImages.map(
            (image) => ({
              ...image,
              image: Buffer.from(image.image, "base64").toString("binary"),
            })
          );
        }
      }
    }

    return successResponse("Product details retrieved", {
      data: productDetail.rows,
      count: productDetail.count,
    });
  } catch (error) {
    return errorResponse("Failed to retrieve product details");
  }
};

const getProductDetailById = async (id) => {
  try {
    if (!id) {
      return missingRequiredParams("id");
    }

    let productDetail = await db.ProductDetail.findOne({
      where: { id: id },
    });

    return successResponse("Product detail retrieved", {
      data: productDetail,
    });
  } catch (error) {
    return errorResponse("Failed to retrieve product detail");
  }
};

const updateProductDetail = async (data) => {
  try {
    if (!data.originalPrice || !data.discountPrice || !data.id) {
      return missingRequiredParams("originalPrice, discountPrice, or id");
    }

    let productDetail = await db.ProductDetail.findOne({
      where: { id: data.id },
      raw: false,
    });

    if (productDetail) {
      productDetail.originalPrice = data.originalPrice;
      productDetail.discountPrice = data.discountPrice;
      productDetail.color = data.color;
      await productDetail.save();
      return successResponse("Product detail updated");
    } else {
      return notValid("Product not found");
    }
  } catch (error) {
    return errorResponse("Failed to update product detail");
  }
};

const deleteProductDetail = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("id");
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
      return notValid("Product Image not found");
    }
  } catch (error) {
    return errorResponse("Failed to delete product detail");
  }
};

// PRODUCT IMAGE
const createProductImage = async (data) => {
  try {
    if (!data.image || !data.productDetailId) {
      return missingRequiredParams("image or productDetailId");
    }

    const productImage = await db.ProductImage.create({
      productDetailId: data.productDetailId,
      image: data.image,
    });

    if (!productImage) {
      return errorResponse("Failed to create new product image");
    }
    return successResponse("Created new product image");
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to create new product image");
  }
};

const getAllProductImage = async (data) => {
  try {
    if (!data.id || !data.limit || !data.offset) {
      return missingRequiredParams("id, limit, or offset");
    }

    let productImage = await db.ProductImage.findAndCountAll({
      where: { productDetailId: data.id },
      limit: +data.limit,
      offset: +data.offset,
    });

    if (productImage.rows && productImage.rows.length > 0) {
      productImage.rows.forEach(
        (item) =>
          (item.image = new Buffer(item.image, "base64").toString("binary"))
      );
    }

    return successResponse("Retrieved product images", {
      data: productImage.rows,
      count: productImage.count,
    });
  } catch (error) {
    return errorResponse("Failed to retrieve product images");
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

    if (productDetailImage) {
      productDetailImage.image = new Buffer(
        productDetailImage.image,
        "base64"
      ).toString("binary");
    }

    return successResponse("Retrieved product image", {
      data: productDetailImage,
    });
  } catch (error) {
    return errorResponse("Failed to retrieve product detail image");
  }
};

const updateProductImage = async (data) => {
  try {
    if (!data.id || !data.caption || !data.image) {
      return missingRequiredParams("id, caption, or image");
    }

    let productImage = await db.ProductImage.findOne({
      where: { id: data.id },
      raw: false,
    });

    if (productImage) {
      productImage.caption = data.caption;
      productImage.image = data.image;
      await productImage.save();
      return successResponse("Updated product image");
    } else {
      return notValid("Product Image not found");
    }
  } catch (error) {
    return errorResponse("Failed to update product image");
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
      return notValid("Product Image not found");
    }
  } catch (error) {
    return errorResponse("Failed to delete product image");
  }
};

// PRODUCT SIZE
const createProductSize = async (data) => {
  try {
    if (!data.productDetailId || !data.sizeId) {
      return missingRequiredParams("productDetailId or sizeId");
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
    return errorResponse("Failed to create product detail size");
  }
};

const getAllProductSize = async (data) => {
  try {
    if (!data.id || !data.limit || !data.offset) {
      return missingRequiredParams("id, limit, or offset");
    } else {
      let productSizes = await db.ProductSize.findAndCountAll({
        where: { productDetailId: data.id },
        limit: +data.limit,
        offset: +data.offset,
        include: [
          { model: db.AllCode, as: "sizeData", attributes: ["value", "code"] },
        ],
        raw: true,
        nest: true,
      });

      for (let i = 0; i < productSizes.rows.length; i++) {
        let receiptDetail = await db.ReceiptDetail.findAll({
          where: { productDetailSizeId: productSizes.rows[i].id },
        });
        let orderDetail = await db.OrderDetail.findAll({
          where: { productId: productSizes.rows[i].id },
        });
        let quantity = 0;

        for (let j = 0; j < receiptDetail.length; j++) {
          quantity += receiptDetail[j].quantity;
        }

        for (let k = 0; k < orderDetail.length; k++) {
          let order = await db.OrderProduct.findOne({
            where: { id: orderDetail[k].orderId },
          });
          if (order.statusId !== "S7") {
            quantity -= orderDetail[k].quantity;
          }
        }
        productSizes.rows[i].stock = quantity;
      }

      return successResponse("Product detail sizes retrieved", productSizes);
    }
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to retrieve product detail sizes");
  }
};

const getProductSizeById = async (id) => {
  try {
    if (!id) {
      return missingRequiredParams("id");
    } else {
      const productDetailSize = await db.ProductDetailSize.findOne({
        where: { id: id },
      });
      if (!productDetailSize) {
        return notValid("Product Size not found");
      }
      return successResponse("Product size retrieved");
    }
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to retrieve product size");
  }
};

const updateProductSize = async (data) => {
  try {
    if (!data.id || !data.sizeId) {
      return missingRequiredParams("id or sizeId");
    } else {
      let productDetailSize = await db.ProductDetailSize.findOne({
        where: { id: data.id },
      });
      if (!productDetailSize) {
        return notValid("Product Size not found");
      }
      productDetailSize.sizeId = data.sizeId;
      productDetailSize.height = data.height;
      productDetailSize.weight = data.weight;
      await productDetailSize.save();
      return successResponse("Product size updated");
    }
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to update product size");
  }
};

const deleteProductSize = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("id");
    } else {
      let productDetailSize = await db.ProductDetailSize.findOne({
        where: { id: data.id },
      });
      if (!productDetailSize) {
        return notValid("Product Size not found");
      }
      await db.ProductDetailSize.destroy({
        where: { id: data.id },
      });
      return successResponse("Product size deleted");
    }
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to delete product size");
  }
};

const getProductFeature = async (limit) => {
  try {
    let res = await db.Product.findAll({
      include: [
        { model: db.AllCode, as: "brandData", attributes: ["value", "code"] },
        {
          model: db.AllCode,
          as: "categoryData",
          attributes: ["value", "code"],
        },
        { model: db.AllCode, as: "statusData", attributes: ["value", "code"] },
      ],
      limit: +limit,
      order: [["view", "DESC"]],
      raw: true,
      nest: true,
    });

    for (let i = 0; i < res.length; i++) {
      let objectFilterProductDetail = {
        where: { productId: res[i].id },
        raw: true,
      };
      res[i].productDetail = await db.ProductDetail.findAll(
        objectFilterProductDetail
      );

      for (let j = 0; j < res[i].productDetail.length; j++) {
        res[i].productDetail[j].productDetailSize =
          await db.ProductDetailSize.findAll({
            where: { productDetailId: res[i].productDetail[j].id },
            raw: true,
          });

        res[i].price = res[i].productDetail[0].discountPrice;

        res[i].productDetail[j].productImage = await db.ProductImage.findAll({
          where: { productDetailId: res[i].productDetail[j].id },
          raw: true,
        });

        for (
          let k = 0;
          k < res[i].productDetail[j].productImage.length > 0;
          k++
        ) {
          res[i].productDetail[j].productImage[k].image = Buffer.from(
            res[i].productDetail[j].productImage[k].image,
            "base64"
          ).toString("binary");
        }
      }
    }

    return successResponse("Retrieved product feature", {
      data: res,
    });
  } catch (error) {
    return errorResponse("Failed to retrieve product feature");
  }
};

const getProductNew = async (limit) => {
  try {
    let res = await db.Product.findAll({
      include: [
        { model: db.AllCode, as: "brandData", attributes: ["value", "code"] },
        {
          model: db.AllCode,
          as: "categoryData",
          attributes: ["value", "code"],
        },
        { model: db.AllCode, as: "statusData", attributes: ["value", "code"] },
      ],
      limit: +limit,
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    });

    for (let i = 0; i < res.length; i++) {
      let objectFilterProductDetail = {
        where: { productId: res[i].id },
        raw: true,
      };
      res[i].productDetail = await db.ProductDetail.findAll(
        objectFilterProductDetail
      );

      for (let j = 0; j < res[i].productDetail.length; j++) {
        res[i].productDetail[j].productDetailSize =
          await db.ProductDetailSize.findAll({
            where: { productDetailId: res[i].productDetail[j].id },
            raw: true,
          });

        res[i].price = res[i].productDetail[0].discountPrice;

        res[i].productDetail[j].productImage = await db.ProductImage.findAll({
          where: { productDetailId: res[i].productDetail[j].id },
          raw: true,
        });

        for (
          let k = 0;
          k < res[i].productDetail[j].productImage.length > 0;
          k++
        ) {
          res[i].productDetail[j].productImage[k].image = Buffer.from(
            res[i].productDetail[j].productImage[k].image,
            "base64"
          ).toString("binary");
        }
      }
    }

    return successResponse("Retrieved new products", {
      data: res,
    });
  } catch (error) {
    return errorResponse("Failed to retrieve new products");
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

    return successResponse("Retrieved products from shopping cart", {
      data: productArr,
    });
  } catch (error) {
    return errorResponse("Failed to retrieve products from shopping cart");
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

    return successResponse("Retrieved recommended products", {
      data: productArr,
    });
  } catch (error) {
    return errorResponse("Failed to retrieve recommended products");
  }
};

export default {
  createProduct,
  getAllProductAdmin,
  getAllProductUser,
  unActiveProduct,
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
