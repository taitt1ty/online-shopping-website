import supplierService from "../services/supplierService";
import { errorResponse } from "../utils/ResponseUtils";

const createSupplier = async (req, res) => {
  try {
    const data = await supplierService.createSupplier(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getSupplierById = async (req, res) => {
  try {
    const data = await supplierService.getSupplierById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getAllSupplier = async (req, res) => {
  try {
    const data = await supplierService.getAllSupplier(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const updateSupplier = async (req, res) => {
  try {
    const data = await supplierService.updateSupplier(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const data = await supplierService.deleteSupplier(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

module.exports = {
  createSupplier,
  getSupplierById,
  getAllSupplier,
  updateSupplier,
  deleteSupplier,
};
