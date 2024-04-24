import db from "../models/index";
const { Op } = require("sequelize");
const {
  missingRequiredParams,
  successResponse,
  errorResponse,
  notValid,
} = require("../utils/ResponseUtils");

const createTypeShip = async (data) => {
  try {
    if (!data.type || !data.price) {
      return missingRequiredParams("Type and price");
    }

    await db.TypeShip.create({
      type: data.type,
      price: data.price,
    });

    return successResponse("New type of ship created");
  } catch (error) {
    console.error("Error in createTypeShip:", error);
    return errorResponse("Failed to create type of ship");
  }
};

const getTypeShipById = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return notValid("ID");
    }
    const typeShip = await db.TypeShip.findByPk(id);
    if (!typeShip) {
      return errorResponse("Type of ship not found");
    }
    return {
      result: typeShip,
      statusCode: 200,
      errors: null,
    };
  } catch (error) {
    console.error("Error in getTypeShipById:", error);
    return errorResponse("Failed to get type of ship by ID");
  }
};

const getAllTypeShip = async (data) => {
  try {
    let objectFilter = {};

    if (data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }

    if (data.keyword) {
      objectFilter.where = {
        type: { [Op.substring]: data.keyword },
      };
    }
    const typeShips = await db.TypeShip.findAndCountAll(objectFilter);
    return {
      result: typeShips.rows,
      statusCode: 200,
      errors: ["Type of ships retrieved successfully!"],
    };
  } catch (error) {
    console.error("Error in getAllTypeShip:", error);
    return errorResponse("Failed to retrieve type of ships");
  }
};

const updateTypeShip = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("ID");
    }
    // Update fields if they are provided in data
    const updatedFields = {};
    if (data.type) {
      updatedFields.type = data.type;
    }
    if (data.price) {
      updatedFields.price = data.price;
    }
    // Updates to records in the database
    const [updatedRows] = await db.TypeShip.update(updatedFields, {
      where: { id: data.id },
    });

    // Check if any records are updated
    if (updatedRows === 0) {
      return errorResponse("Type of ship not found");
    }
    const updatedTypeShip = await db.TypeShip.findByPk(data.id);
    return {
      result: updatedTypeShip,
      statusCode: 200,
      errors: null,
    };
  } catch (error) {
    console.error("Error in updateTypeShip:", error);
    return errorResponse("Failed to update type of ship");
  }
};

const deleteTypeShip = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("ID");
    }

    const typeShip = await db.TypeShip.findOne({
      where: { id: data.id },
    });

    if (!typeShip) {
      return errorResponse("Type of ship not found");
    }

    await db.TypeShip.destroy({
      where: { id: data.id },
    });

    return successResponse("Type of ship deleted");
  } catch (error) {
    console.error("Error in deleteTypeShip:", error);
    return errorResponse("Failed to delete type of ship");
  }
};

export default {
  createTypeShip,
  getTypeShipById,
  getAllTypeShip,
  updateTypeShip,
  deleteTypeShip,
};
