import db from "../models/index";
const { Op } = require("sequelize");
const {
  successResponse,
  errorResponse,
  notFound,
} = require("../utils/ResponseUtils");

const createReceipt = async (data) => {
  try {
    const { userId, supplierId, sizeId, quantity, price } = data;
    if (!userId || !supplierId || !sizeId || !quantity || !price) {
      return errorResponse("Missing required parameters!", 400);
    }

    const receipt = await db.Receipt.create({ userId, supplierId });
    if (receipt) {
      await db.ReceiptDetail.create({
        receiptId: receipt.id,
        sizeId,
        quantity,
        price,
      });
    }

    return successResponse("Receipt created");
  } catch (error) {
    console.error("Error in createReceipt:", error);
    return errorResponse("Failed to create receipt", 500);
  }
};

const createReceiptDetail = async (data) => {
  try {
    const { receiptId, sizeId, quantity, price } = data;
    if (!receiptId || !sizeId || !quantity || !price) {
      return errorResponse("Missing required parameters!");
    }

    await db.ReceiptDetail.create({
      receiptId,
      sizeId,
      quantity,
      price,
    });

    return successResponse("Receipt detail created");
  } catch (error) {
    console.error("Error in createReceiptDetail:", error);
    return errorResponse("Failed to create receipt detail");
  }
};

const getReceiptById = async (id) => {
  try {
    if (!id) {
      return errorResponse("Missing required parameter!");
    }

    const receipt = await db.Receipt.findOne({ where: { id } });
    if (!receipt) {
      return notFound(`Receipt ${id} not found`);
    }

    const receiptDetail = await db.ReceiptDetail.findAll({
      where: { receiptId: id },
    });
    if (receiptDetail && receiptDetail.length > 0) {
      for (let i = 0; i < receiptDetail.length; i++) {
        const productSize = await db.ProductSize.findOne({
          where: { id: receiptDetail[i].sizeId },
          include: [
            {
              model: db.AllCode,
              as: "productSizeData",
              attributes: ["value", "code"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (productSize) {
          receiptDetail[i].productSizeData = productSize;
          receiptDetail[i].productDetailData = await db.ProductDetail.findOne({
            where: { id: productSize.productDetailId },
          });
          if (receiptDetail[i].productDetailData) {
            receiptDetail[i].productData = await db.Product.findOne({
              where: { id: receiptDetail[i].productDetailData.productId },
            });
          }
        }
      }
    }
    return {
      result: [receipt],
      statusCode: 200,
      errors: [`Receipt ${id} found successfully!`],
    };
  } catch (error) {
    console.error("Error in getReceiptById:", error);
    return errorResponse("Failed to get detail receipt", 500);
  }
};

const getAllReceipt = async (data) => {
  try {
    let objectFilter = {};
    if (data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }

    const receipts = await db.Receipt.findAndCountAll(objectFilter);
    const receiptData = [];
    for (let i = 0; i < receipts.rows.length; i++) {
      const receipt = receipts.rows[i];
      const userData = await db.User.findOne({
        where: { id: receipt.userId },
        attributes: ["id", "email", "phoneNumber", "fullName", "address"],
      });
      const supplierData = await db.Supplier.findOne({
        where: { id: receipt.supplierId },
        attributes: ["id", "email", "name"],
      });
      receiptData.push({ receipt, userData, supplierData });
    }

    return {
      result: [receiptData],
      statusCode: 200,
      errors: ["All receipts retrieved successfully!"],
    };
  } catch (error) {
    console.error("Error in getAllReceipt:", error);
    return errorResponse("Failed to get all receipts", 500);
  }
};

const updateReceipt = async (data) => {
  try {
    const { id, userId, supplierId } = data;
    if (!id || !userId || !supplierId) {
      return errorResponse("id, userId, supplierId are required");
    }

    const [updatedRowsCount] = await db.Receipt.update(
      { supplierId },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      return notFound("Receipt not found");
    }

    return successResponse("Receipt updated");
  } catch (error) {
    console.error("Error in updateReceipt:", error);
    return errorResponse("Failed to update receipt");
  }
};

const deleteReceipt = async (data) => {
  try {
    const { id } = data;
    if (!id) {
      return errorResponse("Missing required parameter!");
    }

    let receipt = await db.Receipt.findOne({ where: { id } });
    if (!receipt) {
      return notFound("Receipt not found");
    }

    await db.Receipt.destroy({ where: { id } });

    return successResponse("Receipt deleted");
  } catch (error) {
    console.error("Error in deleteReceipt:", error);
    return errorResponse("Failed to delete receipt");
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
