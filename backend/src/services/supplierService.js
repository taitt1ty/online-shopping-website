import db from "../models/index";
require("dotenv").config();
const { Op } = require("sequelize");
import { successResponse, errorResponse } from "../utils/ResponseUtils";

const createSupplier = async (data) => {
  try {
    const { name, address, phoneNumber, email } = data;
    if (!name || !address || !phoneNumber || !email) {
      return errorResponse("Missing required parameters!");
    }

    await db.Supplier.create({
      name,
      address,
      phoneNumber,
      email,
    });

    return successResponse("Supplier created");
  } catch (error) {
    console.error("Error in createSupplier:", error);
    return errorResponse("Failed to create supplier");
  }
};

const getSupplierById = async (id) => {
  try {
    if (!id) {
      return errorResponse("Missing required parameter!");
    }

    const supplier = await db.Supplier.findOne({ where: { id } });
    if (!supplier) {
      return errorResponse("Supplier not found", 404);
    }

    return {
      result: [supplier],
      statusCode: 200,
      errors: [`Supplier ${id} found successfully!`],
    };
  } catch (error) {
    console.error("Error in getSupplierById:", error);
    return errorResponse("Failed to get supplier details");
  }
};

const getAllSupplier = async (data) => {
  try {
    let objectFilter = {};
    if (data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }
    if (data.keyword) {
      objectFilter.where = {
        ...objectFilter.where,
        name: { [Op.substring]: data.keyword },
      };
    }

    const suppliers = await db.Supplier.findAndCountAll(objectFilter);

    return {
      result: suppliers.rows,
      statusCode: 200,
      errors: ["Suppliers retrieved successfully!"],
    };
  } catch (error) {
    console.error("Error in getAllSupplier:", error);
    return errorResponse("Failed to get all suppliers");
  }
};

const updateSupplier = async (data) => {
  try {
    const { id, name, address, phoneNumber, email } = data;
    if (!id || !name || !address || !phoneNumber || !email) {
      return missingRequiredParams("ID, name, address, phoneNumber, email");
    }

    const [updatedRowsCount] = await db.Supplier.update(
      {
        name,
        address,
        phoneNumber,
        email,
      },
      {
        where: { id },
      }
    );
    if (updatedRowsCount === 0) {
      return notFound("Supplier not found");
    }
    const updatedSupplier = await db.Supplier.findByPk(id);
    return {
      result: [updatedSupplier],
      statusCode: 200,
      errors: ["Supplier updated successfully!"],
    };
  } catch (error) {
    console.error("Error in updateSupplier:", error);
    return errorResponse("Failed to update supplier");
  }
};

const deleteSupplier = async (data) => {
  try {
    const { id } = data;
    if (!id) {
      return missingRequiredParams("id");
    }

    const supplier = await db.Supplier.findOne({ where: { id } });
    if (!supplier) {
      return errorResponse("Supplier not found");
    }

    await db.Supplier.destroy({ where: { id } });

    return successResponse(`Supplier id = ${id} deleted`);
  } catch (error) {
    console.error("Error in deleteSupplier:", error);
    return errorResponse("Failed to delete supplier");
  }
};

module.exports = {
  createSupplier,
  getSupplierById,
  getAllSupplier,
  updateSupplier,
  deleteSupplier,
};
