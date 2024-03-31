const jwt = require("jsonwebtoken");
const db = require("../models");
const { errorResponse, userNotExist, notValid } = require("../utils/ResponseUtils");
require("dotenv").config();

const secretString = process.env.JWT_SECRET;

const middlewareController = {
  verifyTokenUser: async (req, res, next) => {
    try {
      // Check if the Authorization header exists
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          status: false,
          message: "You're not authenticated!",
          refresh: true,
        });
      }
      // Separate token from Authorization header
      const accessToken = token.split(" ")[1];
      // Verify the token
      const payload = jwt.verify(accessToken, secretString);
      // Search for users in the database using the id from the payload
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
};

module.exports = middlewareController;
