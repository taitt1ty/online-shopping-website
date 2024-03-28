const jwt = require('jsonwebtoken');
const db = require('../models');
require('dotenv').config();

const secretString = process.env.JWT_SECRET;

const middlewareController = {
    verifyTokenUser: async (req, res, next) => {
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
        const accessToken = token.split(' ')[1];
        
        jwt.verify(accessToken, secretString, async (err, payload) => {
            if (err) {
                return res.status(403).json({
                    status: false,
                    errMessage: "Token is not valid!",
                    refresh: true,
                });
            }
            // Search for users in the database using the id from the payload
            const user = await db.User.findOne({ where: { id: payload.sub } });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    errMessage: "User does not exist",
                    refresh: true,
                });
            }
            // Attach the user to req.user and continue processing the next middleware
            req.user = user;
            next();
        });
    },
};

module.exports = middlewareController;
