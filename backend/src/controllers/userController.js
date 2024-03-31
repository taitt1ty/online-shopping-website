import userService from "../services/userService";
const { errorResponse, successResponse } = require("../utils/ResponseUtils");

const handleRequest = async (handler, req, res) => {
  try {
    const data = await handler(req.body);
    // Returns the HTTP response
    return res.status(data.statusCode).json(data); 
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse());
  }
};

const registerUser = async (req, res) => {
  return handleRequest(userService.registerUser, req, res);
};

const loginUser = async (req, res) => {
  return handleRequest(userService.loginUser, req, res);
};

const updateUser = async (req, res) => {
  return handleRequest(userService.updateUser, req, res);
};

const deleteUser = async (req, res) => {
  return handleRequest(userService.deleteUser, req, res);
};

const changePassword = async (req, res) => {
  return handleRequest(userService.changePassword, req, res);
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
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getUserById,
  checkPhoneNumber,
  changePassword,
};
