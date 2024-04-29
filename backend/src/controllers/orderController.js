import orderService from "../services/orderService";
import { errorResponse } from "../utils/ResponseUtils";

const createOrder = async (req, res) => {
  try {
    const data = await orderService.createOrder(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getAllOrders = async (req, res) => {
  try {
    const data = await orderService.getAllOrders(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getOrderById = async (req, res) => {
  try {
    const data = await orderService.getOrderById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const updateStatusOrder = async (req, res) => {
  try {
    const data = await orderService.updateStatusOrder(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const data = await orderService.getAllOrdersByUser(req.query.userId);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const paymentOrder = async (req, res) => {
  try {
    const data = await orderService.paymentOrder(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const confirmOrder = async (req, res) => {
  try {
    const data = await orderService.confirmOrder(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const paymentOrderSuccess = async (req, res) => {
  try {
    const data = await orderService.paymentOrderSuccess(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const paymentOrderVNPay = async (req, res) => {
  try {
    const data = await orderService.paymentOrderVNPay(req);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const confirmOrderVNPay = async (req, res) => {
  try {
    const data = await orderService.confirmOrderVNPay(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const paymentOrderVNPaySuccess = async (req, res) => {
  try {
    const data = await orderService.paymentOrderVNPaySuccess(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

const getAllOrdersByShipper = async (req, res) => {
  try {
    const data = await orderService.getAllOrdersByShipper(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error from server"));
  }
};

// const updateImageOrder = async (req, res) => {
//     try {
//         const data = await orderService.updateImageOrder(req.body);
//         return res.status(200).json(data);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json(errorResponse('Error from server'));
//     }
// };

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateStatusOrder,
  getAllOrdersByUser,
  paymentOrder,
  confirmOrder,
  paymentOrderSuccess,
  paymentOrderVNPay,
  confirmOrderVNPay,
  paymentOrderVNPaySuccess,
  getAllOrdersByShipper,
  // updateImageOrder
};
