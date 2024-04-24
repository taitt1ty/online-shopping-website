import shopCartService from "../services/shopCartService";
import { successResponse, errorResponse } from "../utils/ResponseUtils";

const addShopCart = async (req, res) => {
  try {
    const data = await shopCartService.addShopCart(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in addShopCart:", error);
    return res.status(200).json(errorResponse("Error from server"));
  }
};

const getShopCartByUserId = async (req, res) => {
  try {
    const data = await shopCartService.getShopCartByUserId(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getShopCartByUserId:", error);
    return res.status(200).json(errorResponse("Error from server"));
  }
};

const deleteItem = async (req, res) => {
  try {
    const data = await shopCartService.deleteItem(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in deleteItem:", error);
    return res.status(200).json(errorResponse("Error from server"));
  }
};

export default { addShopCart, getShopCartByUserId, deleteItem };
