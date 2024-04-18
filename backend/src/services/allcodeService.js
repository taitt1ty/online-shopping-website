import db from "../models/index";
const { Op } = require("sequelize");
const {
  errorResponse,
  successResponse,
  missingRequiredParams,
  userNotExist,
} = require("../utils/ResponseUtils");

const createNewCode = async (data) => {
  try {
    if (!data.type || !data.value || !data.code) {
      return missingRequiredParams("type, value, or code");
    }

    let res = await db.AllCode.findOne({
      where: { code: data.code },
    });

    if (res) {
      return errorResponse("Code already exists!");
    } else {
      await db.AllCode.create({
        type: data.type,
        value: data.value,
        code: data.code,
      });
      return successResponse("Create new code");
    }
  } catch (error) {
    console.error("Error in create new code:", error);
    return errorResponse();
  }
};

const getAllCode = async (typeInput) => {
  try {
    if (!typeInput) {
      return missingRequiredParams("type");
    }

    let allCode = await db.AllCode.findAll({
      where: { type: typeInput },
    });
    return successResponse(allCode);
  } catch (error) {
    console.error("Error in getAllCodeService:", error);
    return errorResponse();
  }
};

const updateCode = async (data) => {
  try {
    if (!data.value || !data.code || !data.id) {
      return missingRequiredParams("value, code, or id");
    }

    let res = await db.AllCode.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (res) {
      res.value = data.value;
      res.code = data.code;
      await res.save();
      return successResponse("Success");
    } else {
      return userNotExist();
    }
  } catch (error) {
    console.error("Error in handleUpdateAllCode:", error);
    return errorResponse();
  }
};

const getCodeById = async (id) => {
  try {
    if (!id) {
      return missingRequiredParams("id");
    }

    let data = await db.AllCode.findOne({
      where: { id: id },
    });
    return successResponse(data);
  } catch (error) {
    console.error("Error in getDetailAllCodeById:", error);
    return errorResponse();
  }
};

const deleteCode = async (allCodeId) => {
  try {
    if (!allCodeId) {
      return missingRequiredParams("allCodeId");
    }

    let foundAllCode = await db.AllCode.findOne({
      where: { id: allCodeId },
    });
    if (!foundAllCode) {
      return userNotExist();
    }

    await db.AllCode.destroy({
      where: { id: allCodeId },
    });
    return successResponse("The AllCode has been deleted");
  } catch (error) {
    console.error("Error in handleDeleteAllCode:", error);
    return errorResponse();
  }
};

const getListCode = async (data) => {
  try {
    if (!data.type) {
      return missingRequiredParams("type");
    }
    let objectFilter = {
      where: { type: data.type },
    };
    if (data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }
    if (data.keyword !== "")
      objectFilter.where = {
        ...objectFilter.where,
        value: { [Op.substring]: data.keyword },
      };
    let allCode = await db.AllCode.findAndCountAll(objectFilter);
    return successResponse(allCode.rows);
  } catch (error) {
    console.error("Error in getListAllCodeService:", error);
    return errorResponse();
  }
};

export default {
  createNewCode,
  getAllCode,
  updateCode,
  getCodeById,
  deleteCode,
  getListCode,
};
