import typeShipService from "../services/typeShipService";
import { errorResponse } from "../utils/ResponseUtils";

const handleRequest = async (handler, req, res) => {
  try {
    const data = await handler(req.body, req.query, req.params);
    if (!data) {
      return res.status(404).json(errorResponse("Data not found"));
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const createTypeShip = async (req, res) => {
  await handleRequest(typeShipService.createTypeShip, req, res);
};

const getTypeShipById = async (req, res) => {
  await handleRequest(
    async (data) => {
      const typeShip = await typeShipService.getTypeShipById(data.id);
      if (!typeShip.result) {
        return errorResponse("Type of ship not found");
      }
      return typeShip;
    },
    req,
    res
  );
};

const getAllTypeShip = async (req, res) => {
  await handleRequest(typeShipService.getAllTypeShip, req, res);
};

const updateTypeShip = async (req, res) => {
  await handleRequest(
    async (data) => {
      const result = await typeShipService.updateTypeShip(req.body);
      if (!result.result) {
        return errorResponse(result.errors || "Failed to update type of ship");
      }
      return result;
    },
    req,
    res
  );
};

const deleteTypeShip = async (req, res) => {
  await handleRequest(typeShipService.deleteTypeShip, req, res);
};

module.exports = {
  createTypeShip,
  getTypeShipById,
  getAllTypeShip,
  updateTypeShip,
  deleteTypeShip,
};
