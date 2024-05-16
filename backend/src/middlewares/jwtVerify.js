const jwt = require("jsonwebtoken");
import db from "../models/index";
import { errorResponse, userNotExist, notValid } from "../utils/ResponseUtils";
require("dotenv").config();
const secretString = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

const middlewareControllers = {
  verifyTokenUser: (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(403).json(notValid("Token"));
    }

    const accessToken = token.split(" ")[1];

    jwt.verify(accessToken, secretString, async (err, payload) => {
      if (err) {
        return res.status(403).json(notValid("Token"));
      }
      const user = await db.User.findOne({ where: { id: payload.sub } });
      if (!user) {
        return res.status(404).json(userNotExist());
      }

      req.user = user;
      next();
    });
  },

  verifyTokenAdmin: (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(403).json(notValid("Token"));
    }

    const accessToken = token.split(" ")[1];

    jwt.verify(accessToken, secretString, async (err, payload) => {
      if (err) {
        return res.status(403).json(notValid("Token"));
      }
      const user = await db.User.findOne({ where: { id: payload.sub } });
      if (!user) {
        return res.status(404).json(userNotExist());
      }
      if (user && (user.roleId == "R4" || user.roleId == "R1")) {
        //R1: Admin
        req.user = user;
        next();
      } else {
        return res.status(403).json(errorResponse("Bạn không có đủ quyền"));
      }
    });
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).json(errorResponse("Refresh token is missing"));
    }

    jwt.verify(refreshToken, refreshTokenSecret, async (err, payload) => {
      if (err) {
        return res.status(401).json(notValid("Refresh token"));
      }
      const user = await db.User.findOne({ where: { id: payload.sub } });
      if (!user) {
        return res.status(404).json(userNotExist());
      }
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        secretString,
        { expiresIn: "1h" }
      );
      res.json({ accessToken: accessToken });
    });
  },
};

module.exports = middlewareControllers;
