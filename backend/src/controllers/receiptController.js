import receiptService from "../services/receiptService";
import { successResponse, errorResponse } from "../utils/ResponseUtils";

const createReceipt = async (req, res) => {
  try {
    const data = await receiptService.createReceipt(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in createReceipt:", error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const createReceiptDetail = async (req, res) => {
  try {
    const data = await receiptService.createReceiptDetail(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in createReceiptDetail:", error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getReceiptById = async (req, res) => {
  try {
    const data = await receiptService.getReceiptById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getReceiptById:", error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getAllReceipt = async (req, res) => {
  try {
    const data = await receiptService.getAllReceipt(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getAllReceipt:", error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const updateReceipt = async (req, res) => {
  try {
    const data = await receiptService.updateReceipt(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in updateReceipt:", error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const deleteReceipt = async (req, res) => {
  try {
    const data = await receiptService.deleteReceipt(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in deleteReceipt:", error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

module.exports = {
  createReceipt,
  createReceiptDetail,
  getReceiptById,
  getAllReceipt,
  updateReceipt,
  deleteReceipt,
};
