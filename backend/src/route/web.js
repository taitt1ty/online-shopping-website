import express from "express";
import userController from "../controllers/userController";
import allcodeController from "../controllers/allcodeController";
import productController from "../controllers/productController";
import typeShipController from "../controllers/typeShipController";
import voucherController from "../controllers/voucherController";
import shopCartController from "../controllers/shopCartController";
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
    "/api/user",
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
  router.post("/api/code/create", allcodeController.createNewCode);
  router.put("/api/code/update", allcodeController.updateCode);
  router.delete("/api/code/delete", allcodeController.deleteCode);
  router.get("/api/code", allcodeController.getAllCode);
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
    "/api/product/detail/create",
    middlewareControllers.verifyTokenAdmin,
    productController.createProductDetail
  );
  router.get("/api/product/detail", productController.getAllProductDetail);
  router.get("/api/product/detail/:id", productController.getProductDetailById);
  router.put(
    "/api/product/detail/update",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProductDetail
  );
  router.delete(
    "/api/product/detail/delete",
    middlewareControllers.verifyTokenAdmin,
    productController.deleteProductDetail
  );

  // PRODUCT IMAGE
  router.post(
    "/api/product/image/create",
    middlewareControllers.verifyTokenAdmin,
    productController.createProductImage
  );
  router.get("/api/product/image", productController.getAllProductImage);
  router.get("/api/product/image/:id", productController.getProductImageById);
  router.put(
    "/api/product/image/update",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProductImage
  );
  router.delete(
    "/api/product/image/delete",
    middlewareControllers.verifyTokenAdmin,
    productController.deleteProductImage
  );

  // PRODUCT SIZE
  router.post(
    "/api/product/size/create",
    middlewareControllers.verifyTokenAdmin,
    productController.createProductSize
  );
  router.get("/api/product/size", productController.getAllProductSize);
  router.get("/api/product/size/:id", productController.getProductSizeById);
  router.put(
    "/api/product/size/update",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProductSize
  );
  router.delete(
    "/api/product/size/delete",
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

  //---------------------------API TYPE_SHIP------------------------------//
  router.post(
    "/api/type-ship/create",
    middlewareControllers.verifyTokenAdmin,
    typeShipController.createTypeShip
  );
  router.get("/api/type-ship/get-by-id", typeShipController.getTypeShipById);
  router.get("/api/type-ship", typeShipController.getAllTypeShip);
  router.put(
    "/api/type-ship/update",
    middlewareControllers.verifyTokenAdmin,
    typeShipController.updateTypeShip
  );
  router.delete(
    "/api/type-ship/delete",
    middlewareControllers.verifyTokenAdmin,
    typeShipController.deleteTypeShip
  );

  //---------------------------API TYPE_VOUCHER------------------------------//
  router.post(
    "/api/type-voucher/create",
    middlewareControllers.verifyTokenAdmin,
    voucherController.createTypeVoucher
  );
  router.get("/api/type-voucher/get-by-id", voucherController.getTypeVoucherById);
  router.get("/api/type-voucher", voucherController.getAllTypeVoucher);
  router.put(
    "/api/type-voucher/update",
    middlewareControllers.verifyTokenAdmin,
    voucherController.updateTypeVoucher
  );
  router.delete(
    "/api/type-voucher/delete",
    middlewareControllers.verifyTokenAdmin,
    voucherController.deleteTypeVoucher
  );
  router.get(
    "/api/type-voucher/get-select",
    voucherController.getSelectTypeVoucher
  );
  //---------------------------API VOUCHER------------------------------//
  router.post(
    "/api/voucher/create",
    middlewareControllers.verifyTokenAdmin,
    voucherController.createVoucher
  );
  router.get("/api/voucher/:id", voucherController.getVoucherById);
  router.get("/api/voucher", voucherController.getAllVoucher);
  router.put(
    "/api/voucher/update",
    middlewareControllers.verifyTokenAdmin,
    voucherController.updateVoucher
  );
  router.delete(
    "/api/voucher/delete",
    middlewareControllers.verifyTokenAdmin,
    voucherController.deleteVoucher
  );
  router.post(
    "/api/voucher/save-user",
    middlewareControllers.verifyTokenUser,
    voucherController.saveUserVoucher
  );
  router.get(
    "/api/voucher/get-all-by-userid",
    voucherController.getAllVoucherByUserId
  );

  //=================API SHOP_CART==========================//
  router.post(
    "/api/shopcart/add",
    middlewareControllers.verifyTokenUser,
    shopCartController.addShopCart
  );
  router.get(
    "/api/shopcart/get-all-by-userId",
    middlewareControllers.verifyTokenUser,
    shopCartController.getAllShopCartByUserId
  );
  router.delete(
    "/api/shopcart/delete-item",
    middlewareControllers.verifyTokenUser,
    shopCartController.deleteItemShopCart
  );
  app.use("/", router);
};

module.exports = webRoutes;
