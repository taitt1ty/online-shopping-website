import express from "express";
import userController from "../controllers/userController";
import allcodeController from "../controllers/allcodeController";
import middlewareControllers from "../middlewares/jwtVerify";

const initwebRoutes = (app) => {
  const router = express.Router();
  //-----------------------------------------------API USER------------------------------------------//
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

  //-----------------------------------------------API ALLCODE-----------------------------------------//
  router.post("/api/code/create-new", allcodeController.createNewCode);
  router.put("/api/code/update", allcodeController.updateCode);
  router.delete("/api/code/delete", allcodeController.deleteCode);
  router.get("/api/code/get-all", allcodeController.getAllCode);
  router.get("/api/code/get-list", allcodeController.getListCode);
  router.get("/api/code/:id", allcodeController.getCodeById);
  // Use the router for all routes
  app.use("/", router);
};

module.exports = initwebRoutes;
