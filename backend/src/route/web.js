import express from "express";
import userController from "../controllers/userController";
import allcodeController from "../controllers/allcodeController";
import productController from "../controllers/productController";
import middlewareControllers from "../middlewares/jwtVerify";

const webRoutes = (app) => {
  const router = express.Router();
  //---------------------------API USER------------------------------//
  router.post("/api/user/register", userController.registerUser);
  router.post("/api/user/login", userController.loginUser);
  router.put(
    "/api/user/update",
    middlewareControllers.verifyTokenUser,
    userController.updateUser
  );
  router.delete(
    "/api/user/delete",
    middlewareControllers.verifyTokenAdmin,
    userController.deleteUser
  );
  router.get(
    "/api/user/all",
    middlewareControllers.verifyTokenAdmin,
    userController.getAllUser
  );
  router.get("/api/user/:id", userController.getUserById);
  router.post(
    "/api/user/change-password",
    middlewareControllers.verifyTokenUser,
    userController.changePassword
  );

  //---------------------------API ALLCODE------------------------------//
  router.post("/api/code/create-new", allcodeController.createNewCode);
  router.put("/api/code/update", allcodeController.updateCode);
  router.delete("/api/code/delete", allcodeController.deleteCode);
  router.get("/api/code/get-all", allcodeController.getAllCode);
  router.get("/api/code/get-list", allcodeController.getListCode);
  router.get("/api/code/:id", allcodeController.getCodeById);

  //---------------------------API PRODUCT------------------------------//
  router.post(
    "/api/product/create",
    middlewareControllers.verifyTokenAdmin,
    productController.createProduct
  );
  router.get(
    "/api/product/get-all-admin",
    middlewareControllers.verifyTokenAdmin,
    productController.getAllProductAdmin
  );
  router.get("/api/product/get-all-user", productController.getAllProductUser);
  router.get("/api/product/get-by-id", productController.getProductById);
  router.post(
    "/api/product/unactive",
    middlewareControllers.verifyTokenAdmin,
    productController.unActiveProduct
  );
  router.post(
    "/api/product/active",
    middlewareControllers.verifyTokenAdmin,
    productController.activeProduct
  );
  router.put(
    "/api/product/update",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProduct
  );

  // PRODUCT DETAIL
  router.post(
    "/api/product/create-detail",
    middlewareControllers.verifyTokenAdmin,
    productController.createProductDetail
  );
  router.get(
    "/api/product/get-all-detail",
    productController.getAllProductDetail
  );
  router.get(
    "/api/product/get-detail-by-id",
    productController.getProductDetailById
  );
  router.put(
    "/api/product/update-detail",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProductDetail
  );
  router.delete(
    "/api/product/delete-detail",
    middlewareControllers.verifyTokenAdmin,
    productController.deleteProductDetail
  );

  // PRODUCT IMAGE
  router.post(
    "/api/product/create-image",
    middlewareControllers.verifyTokenAdmin,
    productController.createProductImage
  );
  router.get(
    "/api/product/get-all-image",
    productController.getAllProductImage
  );
  router.get(
    "/api/product/get-image-by-id",
    productController.getProductImageById
  );
  router.put(
    "/api/product/update-image",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProductImage
  );
  router.delete(
    "/api/product/delete-image",
    middlewareControllers.verifyTokenAdmin,
    productController.deleteProductImage
  );

  // PRODUCT SIZE
  router.post(
    "/api/product/create-size",
    middlewareControllers.verifyTokenAdmin,
    productController.createProductSize
  );
  router.get("/api/product/get-all-size", productController.getAllProductSize);
  router.get(
    "/api/product/get-size-by-id",
    productController.getProductSizeById
  );
  router.put(
    "/api/product/update-size",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProductSize
  );
  router.delete(
    "/api/product/delete-size",
    middlewareControllers.verifyTokenAdmin,
    productController.deleteProductSize
  );

  router.get("/api/product/get-feature", productController.getProductFeature);
  router.get("/api/product/get-new", productController.getProductNew);
  // router.get("/api/product/get-shopcart", productController.getProductShopCart);
  // router.get(
  //   "/api/product/get-recommend",
  //   productController.getProductRecommend
  // );
  // Use the router for all routes
  app.use("/", router);
};

module.exports = webRoutes;
