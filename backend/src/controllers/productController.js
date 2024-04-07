import productService from "../services/productService";
import { errorResponse, successResponse } from "../utils/ResponseUtils";

const handleRequest = async (handler, req, res) => {
  try {
    const data = await handler(req.body);
    if (!data) {
      return res
        .status(500)
        .json(errorResponse("Failed to process the request"));
    }
    const statusCode = data.statusCode || 200;
    return res.status(statusCode).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Internal server error"));
  }
};

const handlers = {
  // PRODUCT
  createProduct: productService.createProduct,
  getAllProductAdmin: productService.getAllProductAdmin,
  getAllProductUser: productService.getAllProductUser,
  getProductById: productService.getProductById,
  unActiveProduct: productService.unActiveProduct,
  activeProduct: productService.activeProduct,
  updateProduct: productService.updateProduct,

  // PRODUCT DETAIL
  createProductDetail: productService.createProductDetail,
  getAllProductDetail: productService.getAllProductDetail,
  getProductDetailById: productService.getProductDetailById,
  updateProductDetail: productService.updateProductDetail,
  deleteProductDetail: productService.deleteProductDetail,
  
  // PRODUCT IMAGE
  createProductImage: productService.createProductImage,
  getAllProductImage: productService.getAllProductImage,
  getProductImageById: productService.getProductImageById,
  updateProductImage: productService.updateProductImage,
  deleteProductImage: productService.deleteProductImage,

  // PRODUCT SIZE
  createProductSize: productService.createProductSize,
  getAllProductSize: productService.getAllProductSize,
  getProductSizeById: productService.getProductSizeById,
  updateProductSize: productService.updateProductSize,
  deleteProductSize: productService.deleteProductSize,

  getProductFeature: productService.getProductFeature,
  getProductNew: productService.getProductNew,
  //   getProductShopCart: productService.getProductShopCart,
  //   getProductRecommend: productService.getProductRecommend,
};

// Loop through handlers and wrap each handler with handleRequest
for (const handlerName in handlers) {
  if (Object.hasOwnProperty.call(handlers, handlerName)) {
    const handler = handlers[handlerName];
    handlers[handlerName] = async (req, res) => {
      await handleRequest(handler, req, res);
    };
  }
}

module.exports = handlers;
