import db from "../models/index";
const { Op } = require("sequelize");
const {
  missingRequiredParams,
  successResponse,
  errorResponse,
  notFound,
} = require("../utils/ResponseUtils");

//==================TYPE VOUCHER====================//
const createTypeVoucher = async (data) => {
  try {
    const { typeVoucher, value, maxValue, minValue } = data;
    if (!typeVoucher || !value || !maxValue || !minValue) {
      return missingRequiredParams(
        "Type voucher, value, max value, and min value"
      );
    }

    await db.TypeVoucher.create({
      typeVoucher,
      value,
      maxValue,
      minValue,
    });

    return successResponse("New type of voucher created");
  } catch (error) {
    console.error("Error in createNewTypeVoucher:", error);
    return errorResponse("Failed to create type of voucher");
  }
};

const getTypeVoucherById = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return notValid("ID");
    }

    const typeVoucher = await db.TypeVoucher.findByPk(id, {
      include: [
        {
          model: db.AllCode,
          as: "typeVoucherData",
          attributes: ["value", "code"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!typeVoucher) {
      return errorResponse("Type of voucher not found");
    }

    return {
      result: typeVoucher,
      statusCode: 200,
      errors: [`Retrieved type voucher ${id} successfully!`],
    };
  } catch (error) {
    console.error("Error in getTypeVoucherById:", error);
    return errorResponse("Failed to get type of voucher by ID");
  }
};

const getAllTypeVoucher = async (data) => {
  try {
    let objectFilter = {
      include: [
        {
          model: db.AllCode,
          as: "typeVoucherData",
          attributes: ["value", "code"],
        },
      ],
      raw: true,
      nest: true,
    };

    if (data && data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }

    const typeVouchers = await db.TypeVoucher.findAndCountAll(objectFilter);

    return {
      result: typeVouchers.rows,
      statusCode: 200,
      errors: ["Retrieved all type voucher successfully!"],
    };
  } catch (error) {
    console.error("Error in getAllTypeVoucher:", error);
    return errorResponse("Failed to get all type of vouchers");
  }
};

const updateTypeVoucher = async (data) => {
  try {
    const { id, typeVoucher, value, maxValue, minValue } = data;
    if (!id || !typeVoucher || !value || !maxValue || !minValue) {
      return missingRequiredParams(
        "ID, Type voucher, value, max value, and min value"
      );
    }
    const [updatedRowsCount] = await db.TypeVoucher.update(
      {
        typeVoucher,
        value,
        maxValue,
        minValue,
      },
      {
        where: { id: id },
        returning: true,
      }
    );
    if (updatedRowsCount === 0) {
      return errorResponse("Type of voucher not found or update failed");
    }
    const updatedTypeVoucher = await db.TypeVoucher.findByPk(data.id);
    return {
      result: updatedTypeVoucher,
      statusCode: 200,
      errors: ["Voucher updated successfully!"],
    };
  } catch (error) {
    console.error("Error in updateTypeVoucher:", error);
    return errorResponse("Failed to update type of voucher");
  }
};

const deleteTypeVoucher = async (data) => {
  try {
    const { id } = data;

    if (!id) {
      return missingRequiredParams("ID");
    }

    const typeVoucherInstance = await db.TypeVoucher.findOne({
      where: { id },
    });

    if (!typeVoucherInstance) {
      return notFound("Type of voucher");
    }

    await db.TypeVoucher.destroy({
      where: { id },
    });

    return successResponse("Type of voucher deleted");
  } catch (error) {
    console.error("Error in deleteTypeVoucher:", error);
    return errorResponse("Failed to delete type of voucher");
  }
};

const getSelectTypeVoucher = async () => {
  try {
    const typeVouchers = await db.TypeVoucher.findAll({
      include: [
        {
          model: db.AllCode,
          as: "typeVoucherData",
          attributes: ["value", "code"],
        },
      ],
      raw: true,
      nest: true,
    });
    return {
      result: typeVouchers,
      statusCode: 200,
      errors: ["Retrieved select type of vouchers successfully"],
    };
  } catch (error) {
    console.error("Error in getSelectTypeVoucher:", error);
    return errorResponse("Failed to get select type of vouchers");
  }
};

//=======================VOUCHER===================
const createVoucher = async (data) => {
  try {
    const { fromDate, toDate, typeVoucherId, amount, codeVoucher } = data;
    if (!fromDate || !toDate || !typeVoucherId || !amount || !codeVoucher) {
      return missingRequiredParams(
        "From date, to date, type voucher ID, amount, and code voucher"
      );
    }

    await db.Voucher.create({
      fromDate,
      toDate,
      typeVoucherId,
      amount,
      codeVoucher,
    });

    return successResponse("New voucher created");
  } catch (error) {
    console.error("Error in createNewVoucher:", error);
    return errorResponse("Failed to create voucher");
  }
};

const getVoucherById = async (id) => {
  try {
    if (!id) {
      return missingRequiredParams("ID");
    }

    const voucher = await db.Voucher.findByPk(id);

    if (!voucher) {
      return notFound("Voucher not found");
    }

    return {
      result: voucher,
      statusCode: 200,
      errors: [`Retrieved voucher ${id} successfully!`],
    };
  } catch (error) {
    console.error("Error in getDetailVoucherById:", error);
    return errorResponse("Failed to get voucher by ID");
  }
};

const getAllVoucher = async (data) => {
  try {
    let objectFilter = {
      include: [
        {
          model: db.TypeVoucher,
          as: "typeVoucherOfVoucherData",
          include: [
            {
              model: db.AllCode,
              as: "typeVoucherData",
              attributes: ["value", "code"],
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    };

    if (data && data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }

    const vouchers = await db.Voucher.findAndCountAll(objectFilter);

    for (let i = 0; i < vouchers.rows.length; i++) {
      const voucherUsedCount = await db.VoucherUsed.findAll({
        where: { voucherId: vouchers.rows[i].id, status: 1 },
      });
      vouchers.rows[i].usedAmount = voucherUsedCount.length;
    }

    return {
      result: vouchers.rows,
      statusCode: 200,
      errors: ["Retrieved all voucher successfully!"],
    };
  } catch (error) {
    console.error("Error in getAllVoucher:", error);
    return errorResponse("Failed to get all vouchers");
  }
};

const updateVoucher = async (data) => {
  try {
    const { id, fromDate, toDate, typeVoucherId, amount, codeVoucher } = data;
    if (
      !id ||
      !fromDate ||
      !toDate ||
      !typeVoucherId ||
      !amount ||
      !codeVoucher
    ) {
      return missingRequiredParams(
        "ID, From date, to date, type voucher ID, amount, and code voucher"
      );
    }
    const [updatedRowsCount] = await db.Voucher.update(
      {
        fromDate,
        toDate,
        typeVoucherId,
        amount,
        codeVoucher,
      },
      {
        where: { id: id },
      }
    );
    if (updatedRowsCount === 0) {
      return notFound("Voucher not found");
    }
    const updatedVoucher = await db.Voucher.findByPk(data.id);
    return {
      result: [updatedVoucher],
      statusCode: 200,
      errors: ["Voucher updated successfully!"],
    };
  } catch (error) {
    console.error("Error in updateVoucher:", error);
    return errorResponse("Failed to update voucher");
  }
};

const deleteVoucher = async (data) => {
  try {
    const { id } = data;
    if (!id) {
      return missingRequiredParams("ID");
    }

    const voucherInstance = await db.Voucher.findOne({
      where: { id: id },
    });

    if (!voucherInstance) {
      return notFound("Voucher not found");
    }

    await db.Voucher.destroy({
      where: { id: id },
    });

    return successResponse("Voucher deleted");
  } catch (error) {
    console.error("Error in deleteVoucher:", error);
    return errorResponse("Failed to delete voucher");
  }
};

const saveUserVoucher = async (data) => {
  try {
    const { voucherId, userId } = data;
    if (!voucherId || !userId) {
      return missingRequiredParams("Voucher ID and User ID");
    }
    // Check if the voucher has been used by the user or not
    let voucherUsed = await db.VoucherUsed.findOne({
      where: { voucherId: voucherId, userId: userId },
    });

    if (voucherUsed) {
      return errorResponse("Voucher already saved in stock");
    }
    await db.VoucherUsed.create({
      voucherId,
      userId,
      status: 0,
    });
    return successResponse("User saved voucher");
  } catch (error) {
    console.error("Error in saveUserVoucher:", error);
    return errorResponse("Failed to save user voucher");
  }
};

const getVoucherByUserId = async (data) => {
  try {
    if (!data || !data.id) {
      return missingRequiredParams("User ID");
    }
    const { id, limit, offset } = data;
    if (!id) {
      return missingRequiredParams("User ID");
    }

    let objectFilter = { where: { userId: id, status: 0 } };

    if (limit && offset) {
      objectFilter.limit = +limit;
      objectFilter.offset = +offset;
    }

    let vouchers = await db.VoucherUsed.findAndCountAll(objectFilter);

    for (let i = 0; i < vouchers.rows.length; i++) {
      const voucherData = await db.Voucher.findOne({
        where: { id: vouchers.rows[i].voucherId },
        include: [
          {
            model: db.TypeVoucher,
            as: "typeVoucherOfVoucherData",
            include: [
              {
                model: db.AllCode,
                as: "typeVoucherData",
                attributes: ["value", "code"],
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });

      if (voucherData && voucherData.id) {
        const voucherUsedCount = await db.VoucherUsed.count({
          where: { voucherId: voucherData.id, status: 1 },
        });
        voucherData.usedAmount = voucherUsedCount;
        vouchers.rows[i].voucherData = voucherData;
      }
    }

    return {
      result: vouchers.rows,
      statusCode: 200,
      errors: ["Retrieved all vouchers by user id successfully!"],
    };
  } catch (error) {
    console.error("Error in getVoucherByUserId:", error);
    return errorResponse("Failed to get all vouchers by user ID");
  }
};

export default {
  createTypeVoucher,
  getTypeVoucherById,
  getAllTypeVoucher,
  updateTypeVoucher,
  deleteTypeVoucher,
  createVoucher,
  getVoucherById,
  getAllVoucher,
  updateVoucher,
  deleteVoucher,
  getSelectTypeVoucher,
  saveUserVoucher,
  getVoucherByUserId,
};
