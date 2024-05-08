import db from "../models/index";
const { Op } = require("sequelize");
const {
  errorResponse,
  successResponse,
  missingRequiredParams,
  notFound,
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
    if (!typeInput || typeof typeInput !== "string") {
      return missingRequiredParams("type is");
    }
    let code = await db.AllCode.findAll({
      where: { type: typeInput },
    });
    if (code.length === 0) {
      return notFound(`Type code ${typeInput}`);
    }
    return {
      result: [code],
      statusCode: 200,
      errors: [`Get all ${typeInput} successfully!`],
    };
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const updateCode = async (data) => {
  try {
    if (!data.value || !data.code || !data.id) {
      return missingRequiredParams("value, code, id are");
    }
    let res = await db.AllCode.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (res) {
      res.value = data.value;
      res.code = data.code;
      await res.save();
      return successResponse(`Update code ${id}`);
    } else {
      return errorResponse(error.message);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
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
    return {
      result: [data],
      statusCode: 200,
      errors: [`Get code with id = ${id} successfully!`],
    };
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const deleteCode = async (id) => {
  try {
    if (!id) {
      return missingRequiredParams("id");
    }
    let foundAllCode = await db.AllCode.findOne({
      where: { id: id },
    });
    if (!foundAllCode) {
      return userNotExist();
    }
    await db.AllCode.destroy({
      where: { id: id },
    });
    return successResponse(`Delete code with id = ${id}`);
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
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
    return {
      result: [allCode.rows],
      statusCode: 200,
      errors: [`Get list code of ${data.type} successfully!`],
    };
  } catch (error) {
    console.error(error);
    return errorResponse(error);
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
