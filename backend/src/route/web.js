import express from "express";
import userController from "../controllers/userController";
import middlewareController from "../middlewares/jwtVerify";

const initwebRoutes = (app) => {
  const router = express.Router();
  //-----------------------------------------------API USER------------------------------------------//
  router.post("/api/user/register", userController.registerUser);
  router.post("/api/user/login", userController.loginUser);
  router.put(
    "/api/user/update",
    middlewareController.verifyTokenUser,
    userController.updateUser
  );
  router.delete("/api/user/delete", userController.deleteUser);
  router.get("/api/user/all", userController.getAllUser);
  router.get("/api/user/:id", userController.getUserById);
  router.post(
    "/api/user/change-password",
    middlewareController.verifyTokenUser,
    userController.changePassword
  );

  // Use the router for all routes
  app.use("/", router);
};

module.exports = initwebRoutes;
