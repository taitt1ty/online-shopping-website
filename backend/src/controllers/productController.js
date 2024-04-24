import productService from "../services/productService";
import { errorResponse } from "../utils/ResponseUtils";

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

// PRODUCT
const createProduct = async (req, res) => {
  await handleRequest(productService.createProduct, req, res);
};

const getAllProductAdmin = async (req, res) => {
  try {
    const data = await productService.getAllProductAdmin(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json(errorResponse("Internal server error"));
  }
};

const getAllProductUser = async (req, res) => {
  try {
    const data = await productService.getAllProductUser(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json(errorResponse("Internal server error"));
  }
};

const getProductById = async (req, res) => {
  try {
    const data = await productService.getProductById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const unActiveProduct = async (req, res) => {
  await handleRequest(productService.unActiveProduct, req, res);
};

const activeProduct = async (req, res) => {
  await handleRequest(productService.activeProduct, req, res);
};

const updateProduct = async (req, res) => {
  await handleRequest(productService.updateProduct, req, res);
};

// PRODUCT DETAIL
const createProductDetail = async (req, res) => {
  await handleRequest(productService.createProductDetail, req, res);
};

const getAllProductDetail = async (req, res) => {
  try {
    const { id, limit, offset } = req.query;
    const requestData = { id, limit, offset };
    const data = await productService.getAllProductDetail(requestData);
    return res.status(data.statusCode).json(data);
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json(errorResponse("Internal server error"));
  }
};

const getProductDetailById = async (req, res) => {
  try {
    const data = await productService.getProductDetailById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};
const updateProductDetail = async (req, res) => {
  await handleRequest(productService.updateProductDetail, req, res);
};

const deleteProductDetail = async (req, res) => {
  await handleRequest(productService.deleteProductDetail, req, res);
};

// PRODUCT IMAGE
const createProductImage = async (req, res) => {
  await handleRequest(productService.createProductImage, req, res);
};

const getAllProductImage = async (req, res) => {
  try {
    const { id, limit, offset } = req.query;

    if (!id || !limit || !offset) {
      return res
        .status(400)
        .json(missingRequiredParams("id, limit, or offset"));
    }

    const data = { id, limit, offset };
    const result = await productService.getAllProductImage(data);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error getting product images:", error);
    return res
      .status(500)
      .json(errorResponse("Failed to retrieve product images"));
  }
};

const getProductImageById = async (req, res) => {
  try {
    const data = await productService.getProductImageById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const updateProductImage = async (req, res) => {
  await handleRequest(productService.updateProductImage, req, res);
};

const deleteProductImage = async (req, res) => {
  await handleRequest(productService.deleteProductImage, req, res);
};

// PRODUCT SIZE
const createProductSize = async (req, res) => {
  await handleRequest(productService.createProductSize, req, res);
};

const getAllProductSize = async (req, res) => {
  await handleRequest(productService.getAllProductSize, req, res);
};

const getProductSizeById = async (req, res) => {
  try {
    const data = await productService.getProductSizeById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const updateProductSize = async (req, res) => {
  await handleRequest(productService.updateProductSize, req, res);
};

const deleteProductSize = async (req, res) => {
  await handleRequest(productService.deleteProductSize, req, res);
};

// Additional Product Functions
const getProductFeature = async (req, res) => {
  await handleRequest(productService.getProductFeature, req, res);
};

const getProductNew = async (req, res) => {
  await handleRequest(productService.getProductNew, req, res);
};

module.exports = {
  createProduct,
  getAllProductAdmin,
  getAllProductUser,
  getProductById,
  unActiveProduct,
  activeProduct,
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
};
