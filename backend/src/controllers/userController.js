import userService from '../services/userService';
const { errorResponse } = require('../utils/ResponseUtils');


const handleRequest = async (handler, req, res) => {
    try {
        const data = await handler(req.body);
        return res.status(success).json(data);
    } catch (error) {
        console.log(error);
        return errorResponse();
    }
};

const handleCreateNewUser = async (req, res) => {
    return handleRequest(userService.handleCreateNewUser, req, res);
};

const handleUpdateUser = async (req, res) => {
    return handleRequest(userService.updateUser, req, res);
};

const handleDeleteUser = async (req, res) => {
    return handleRequest(userService.deleteUser, req, res);
};

const handleLogin = async (req, res) => {
    return handleRequest(userService.handleLogin, req, res);
};

const getAllUser = async (req, res) => {
    return handleRequest(userService.getAllUser, req, res);
};

const getUserById = async (req, res) => {
    return handleRequest(userService.getUserById, req, res);
};

const checkPhoneNumber = async (req, res) => {
    return handleRequest(userService.checkPhoneNumber, req, res);
};

module.exports = {
    handleCreateNewUser,
    handleUpdateUser,
    handleDeleteUser,
    handleLogin,
    getAllUser,
    getUserById,
    checkPhoneNumber
};
