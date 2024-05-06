import allCodeService from "../services/allcodeService";
import { errorResponse } from "../utils/ResponseUtils";

const handleRequest = async (handler, req, res) => {
  try {
    const data = await handler(req.body);
    if (!data) {
      return res
        .status(500)
        .json(errorResponse("Failed to process the request"));
    }
    const statusCode = data.statusCode === 0 ? 200 : 500;
    return res.status(statusCode).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Internal server error"));
  }
};

const createNewCode = async (req, res) => {
  return handleRequest(allCodeService.createNewCode, req, res);
};

const getAllCode = async (req, res) => {
  try {
    const data = await allCodeService.getAllCode(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json(errorResponse("Internal server error"));
  }
};

const updateCode = async (req, res) => {
  return handleRequest(allCodeService.updateCode, req, res);
};

const getCodeById = async (req, res) => {
  try {
    const data = await allCodeService.getCodeById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const deleteCode = async (req, res) => {
  try {
    const data = await allCodeService.deleteCode(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getListCode = async (req, res) => {
  try {
    const data = await allCodeService.getListCode(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json(errorResponse("Internal server error"));
  }
};

module.exports = {
  createNewCode,
  getAllCode,
  updateCode,
  getCodeById,
  deleteCode,
  getListCode,
};
