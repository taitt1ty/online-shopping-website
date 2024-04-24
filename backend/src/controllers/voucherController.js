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
  await handleRequest(
    async (data) => {
      const typeVoucher = await voucherService.getTypeVoucherById(data.id);
      if (!typeVoucher.result) {
        return errorResponse("Type of voucher not found");
      }
      return typeVoucher;
    },
    req,
    res
  );
};

const getAllTypeVoucher = async (req, res) => {
  return handleRequest(voucherService.getAllTypeVoucher, req.query, res);
};

const updateTypeVoucher = async (req, res) => {
  await handleRequest(
    async (data) => {
      const typeVoucher = await voucherService.updateTypeVoucher(req.body);
      if (!typeVoucher) {
        return errorResponse("Failed to update type of voucher");
      }
      return typeVoucher;
    },
    req,
    res
  );
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
  await handleRequest(
    async (data) => {
      const voucher = await voucherService.getVoucherById(data.id);
      if (!voucher.result) {
        return errorResponse("Voucher not found");
      }
      return voucher;
    },
    req,
    res
  );
};

const getAllVoucher = async (req, res) => {
  return handleRequest(voucherService.getAllVoucher, req.query, res);
};

const updateVoucher = async (req, res) => {
  await handleRequest(
    async (data) => {
      const voucher = await voucherService.updateVoucher(req.body);
      if (!voucher) {
        return errorResponse("Failed to update voucher");
      }
      return voucher;
    },
    req,
    res
  );
};

const deleteVoucher = async (req, res) => {
  return handleRequest(voucherService.deleteVoucher, req, res);
};

const saveUserVoucher = async (req, res) => {
  await handleRequest(
    async (data) => {
      const voucher = await voucherService.saveUserVoucher(req.body);
      if (!voucher) {
        return errorResponse("Failed to save user voucher");
      }
      return voucher;
    },
    req,
    res
  );
};

const getAllVoucherByUserId = async (req, res) => {
  return handleRequest(voucherService.getVoucherByUserId, req, res);
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
