const jwt = require("jsonwebtoken");
const db = require("../models");
const {
  errorResponse,
  userNotExist,
  notValid,
} = require("../utils/ResponseUtils");
require("dotenv").config();

const secretString = process.env.JWT_SECRET;
const accessTokenExpiresIn = "1h";

const middlewareController = {
  verifyTokenUser: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return errorAuth(res);
      }
      const accessToken = token.split(" ")[1];
      const payload = jwt.verify(accessToken, secretString);
      // Check accessToken expiration time
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return notValid(res, "Token");
      }
      const user = await db.User.findOne({ where: { id: payload.sub } });
      if (!user) {
        return userNotExist(res);
      }
      // Attach the user to req.user and continue processing the next middleware
      req.user = user;
      next();
    } catch (error) {
      // Handle errors
      if (error.name === "JsonWebTokenError") {
        return notValid(res, "Token");
      }
      console.error("Middleware Error:", error);
      return errorResponse(res);
    }
  },
  verifyTokenAdmin: (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, secretString, async (err, payload) => {
        if (err) {
          return notValid(res, "Token");
        }
        // Check accessToken expiration time
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          return notValid(res, "Token");
        }
        const user = await db.User.findOne({ where: { id: payload.sub } });
        if (!user) {
          return userNotExist(res);
        }
        if (user && (user.roleId == "R4" || user.roleId == "R1")) {
          req.user = user;
          next();
        } else {
          return res.status(404).json({
            status: false,
            errMessage: "You do not have sufficient rights!",
            refresh: true,
          });
        }
      });
    } else {
      return errorAuth(res);
    }
  },
};

module.exports = middlewareController;
