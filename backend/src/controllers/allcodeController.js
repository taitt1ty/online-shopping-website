import allCodeService from "../services/allcodeService";
import { errorResponse } from "../utils/ResponseUtils";

const handleRequest = async (handler, req, res) => {
  try {
    const data = await handler(req.body);
    if (!data) {
      return res.status(500).json(errorResponse());
    }
    const statusCode = data.errCode === 0 ? 200 : 500;
    return res.status(statusCode).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse());
  }
};

const createNewCode = async (req, res) => {
  return handleRequest(allCodeService.createNewCode, req, res);
};

const getAllCode = async (req, res) => {
  return handleRequest(allCodeService.getAllCode, req, res);
};

const updateCode = async (req, res) => {
  return handleRequest(allCodeService.updateCode, req, res);
};

const getCodeById = async (req, res) => {
  return handleRequest(allCodeService.getCodeById, req, res);
};

const deleteCode = async (req, res) => {
  return handleRequest(allCodeService.deleteCode, req, res);
};

const getListCode = async (req, res) => {
  return handleRequest(allCodeService.getListCode, req, res);
};

module.exports = {
  createNewCode,
  getAllCode,
  updateCode,
  getCodeById,
  deleteCode,
  getListCode,
};
