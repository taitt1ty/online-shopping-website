import voucherService from "../services/voucherService";
import { errorResponse } from "../utils/ResponseUtils";

const handleRequest = async (handler, req, res) => {
  try {
    const data = await handler(req.body);
    if (!data) {
      return res.status(404).json(errorResponse("Data not found"));
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

// ========================TYPE VOUCHER====================== //

const createTypeVoucher = async (req, res) => {
  return handleRequest(voucherService.createTypeVoucher, req, res);
};

const getTypeVoucherById = async (req, res) => {
  try {
    const data = await voucherService.getTypeVoucherById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getAllTypeVoucher = async (req, res) => {
  return handleRequest(voucherService.getAllTypeVoucher, req, res);
};

const updateTypeVoucher = async (req, res) => {
  return handleRequest(voucherService.updateTypeVoucher, req, res);
};

const deleteTypeVoucher = async (req, res) => {
  return handleRequest(voucherService.deleteTypeVoucher, req, res);
};

const getSelectTypeVoucher = async (req, res) => {
  return handleRequest(voucherService.getSelectTypeVoucher, req, res);
};

// =========================VOUCHER======================== //

const createVoucher = async (req, res) => {
  return handleRequest(voucherService.createVoucher, req, res);
};

const getVoucherById = async (req, res) => {
  try {
    const data = await voucherService.getVoucherById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getAllVoucher = async (req, res) => {
  return handleRequest(voucherService.getAllVoucher, req, res);
};

const updateVoucher = async (req, res) => {
  return handleRequest(voucherService.updateVoucher, req, res);
};

const deleteVoucher = async (req, res) => {
  return handleRequest(voucherService.deleteVoucher, req, res);
};

const saveUserVoucher = async (req, res) => {
    return handleRequest(voucherService.saveUserVoucher, req, res);
};

const getAllVoucherByUserId = async (req, res) => {
  try {
    const data = await voucherService.getVoucherByUserId(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

module.exports = {
  // TYPE VOUCHER
  createTypeVoucher,
  getTypeVoucherById,
  getAllTypeVoucher,
  updateTypeVoucher,
  deleteTypeVoucher,
  getSelectTypeVoucher,
  // VOUCHER
  createVoucher,
  getVoucherById,
  getAllVoucher,
  updateVoucher,
  deleteVoucher,
  saveUserVoucher,
  getAllVoucherByUserId,
};
