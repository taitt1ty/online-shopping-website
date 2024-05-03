import { v4 as uuidv4 } from "uuid";
import db from "../models/index";
import paypal from "paypal-rest-sdk";
const { Op } = require("sequelize");
var querystring = require("qs");
var crypto = require("crypto");
require("dotenv").config();
import {
  successResponse,
  errorResponse,
  missingRequiredParams,
  notFound,
} from "../utils/ResponseUtils";

const createOrder = async (data) => {
  try {
    if (!data.addressUserId || !data.typeShipId) {
      return missingRequiredParams("addressUserId and typeShipId");
    }
    const product = await db.Order.create({
      addressUserId: data.addressUserId,
      isPaymentOnline: data.isPaymentOnline,
      statusId: "S3",
      typeShipId: data.typeShipId,
      voucherId: data.voucherId,
      note: data.note,
    });

    // Update orderId for products in shop cart
    const updatedShopCart = data.arrDataShopCart.map((item) => ({
      ...item,
      orderId: product.id,
    }));

    // Add order detail
    await db.OrderDetail.bulkCreate(updatedShopCart);

    // Delete ordered products from the shopping cart
    const shopCartItems = await db.ShopCart.findAll({
      where: { userId: data.userId, statusId: 0 },
    });
    if (shopCartItems.length > 0) {
      await db.ShopCart.destroy({ where: { userId: data.userId } });
      // Update product inventory quantity
      for (const cartItem of updatedShopCart) {
        const productSize = await db.productSize.findByPk(cartItem.productId);
        if (productSize) {
          productSize.stock -= cartItem.quantity;
          await productSize.save();
        }
      }
    }

    // Voucher code used
    if (data.voucherId && data.userId) {
      const voucherUse = await db.VoucherUsed.findOne({
        where: { voucherId: data.voucherId, userId: data.userId },
      });
      if (voucherUse) {
        voucherUse.status = 1;
        await voucherUse.save();
      }
    }
    return successResponse("Order created");
  } catch (error) {
    console.error("Error in create order:", error);
    return errorResponse("Error from server");
  }
};

const getAllOrders = async (data) => {
  try {
    let objectFilter = {
      include: [
        { model: db.TypeShip, as: "typeShipData" },
        { model: db.Voucher, as: "voucherData" },
        { model: db.AllCode, as: "statusOrderData" },
      ],
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    };
    if (data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }
    if (data.statusId && data.statusId !== "ALL") {
      objectFilter.where = { statusId: data.statusId };
    }
    let { rows, count } = await db.Order.findAndCountAll(objectFilter);
    if (rows.length === 0) {
      return {
        result: [],
        statusCode: 0,
        errors: ["No orders found!"],
      };
    }
    for (let i = 0; i < rows.length; i++) {
      let [addressUser, shipper] = await Promise.all([
        db.AddressUser.findOne({ where: { id: rows[i].addressUserId } }),
        db.User.findOne({ where: { id: rows[i].shipperId } }),
      ]);

      if (addressUser) {
        let user = await db.User.findOne({ where: { id: addressUser.userId } });
        rows[i].userData = user;
        rows[i].addressUser = addressUser;
        rows[i].shipperData = shipper;
      }
    }
    return {
      result: rows,
      statusCode: 0,
      errors: ["Retrieved all order successfully!"],
    };
  } catch (error) {
    console.error("Error in get all order:", error);
    return errorResponse("Error from server");
  }
};

const getOrderById = async (id) => {
  try {
    if (!id) {
      return missingRequiredParams("Id");
    }
    const processImage = async (link) => {
      return link;
    };
    const order = await db.Order.findOne({
      where: { id: id },
      include: [
        { model: db.TypeShip, as: "typeShipData" },
        { model: db.Voucher, as: "voucherData" },
        { model: db.AllCode, as: "statusOrderData" },
      ],
      raw: true,
      nest: true,
    });
    if (!order) {
      return notFound(`Order with id ${id}`);
    }
    const addressUser = await db.AddressUser.findOne({
      where: { id: order.addressUserId },
    });
    if (!addressUser) {
      return notFound(`addressUser for order  with id ${addressUser.id}`);
    }
    const user = await db.User.findOne({
      where: { id: addressUser.userId },
      attributes: { exclude: ["password", "image"] },
      raw: true,
      nest: true,
    });
    if (!user) {
      return notFound(`User for addressUser with id ${addressUser.id}.`);
    }
    if (order.image) {
      order.image = await processImage(order.image);
    }
    order.voucherData.typeVoucherOfVoucherData = await db.TypeVoucher.findOne({
      where: { id: order.voucherData.typeVoucherId },
    });
    const orderDetail = await db.OrderDetail.findAll({
      where: { orderId: id },
    });
    for (let i = 0; i < orderDetail.length; i++) {
      const productSize = await db.ProductSize.findOne({
        where: { id: orderDetail[i].productId },
        include: [{ model: db.AllCode, as: "sizeData" }],
        raw: true,
        nest: true,
      });
      orderDetail[i].productSize = productSize;
      orderDetail[i].productDetail = await db.ProductDetail.findOne({
        where: { id: productSize.productDetailId },
      });
      orderDetail[i].product = await db.Product.findOne({
        where: { id: orderDetail[i].productDetail.productId },
      });
      const productImages = await db.ProductImage.findAll({
        where: { productDetailId: orderDetail[i].productDetail.id },
      });
      for (let j = 0; j < productImages.length; j++) {
        if (productImages[j].image) {
          productImages[j].image = await processImage(productImages[j].image);
        }
      }
      orderDetail[i].productImage = productImages;
    }
    order.orderDetail = orderDetail;
    order.addressUser = addressUser;
    order.userData = user;
    return {
      result: [order],
      statusCode: 200,
      errors: [`Retrieved order ${id} successfully!`],
    };
  } catch (error) {
    return errorResponse(error.message);
  }
};

const updateStatusOrder = async (data) => {
  try {
    const { id, statusId, dataOrder } = data;
    if (!id || !statusId) {
      return missingRequiredParams("Id, statusId are");
    }
    const [updatedRowsCount, updatedRows] = await db.Order.update(
      { statusId: statusId },
      { where: { id: id } }
    );
    if (updatedRowsCount === 0) {
      return notFound(`Order with id ${id}`);
    }
    console.log("Updated rows:", updatedRows);
    if (
      statusId === "S7" &&
      dataOrder &&
      dataOrder.orderDetail &&
      dataOrder.orderDetail.length > 0
    ) {
      for (let i = 0; i < dataOrder.orderDetail.length; i++) {
        let productSize = await db.ProductSize.findOne({
          where: { id: dataOrder.orderDetail[i].productSize.id },
        });

        if (!productSize) {
          return notFound(
            `ProductSize for id ${dataOrder.orderDetail[i].productSize.id}.`
          );
        }
        productSize.stock += dataOrder.orderDetail[i].quantity;
        await productSize.save();
      }
    }
    return successResponse("Updated status order");
  } catch (error) {
    return errorResponse(error.message);
  }
};

const getAllOrdersByUser = async (userId) => {
  try {
    if (!userId) {
      return missingRequiredParams("userId");
    }
    const addressUsers = await db.AddressUser.findAll({
      where: { userId: userId },
    });
    const result = [];
    for (let i = 0; i < addressUsers.length; i++) {
      const orders = await db.Order.findAll({
        where: { addressUserId: addressUsers[i].id },
        include: [
          { model: db.TypeShip, as: "typeShipData" },
          { model: db.Voucher, as: "voucherData" },
          { model: db.AllCode, as: "statusOrderData" },
        ],
        raw: true,
        nest: true,
      });
      for (let j = 0; j < orders.length; j++) {
        orders[j].voucherData.typeVoucherOfVoucherData =
          await db.TypeVoucher.findOne({
            where: { id: orders[j].voucherData.typeVoucherId },
          });
        const orderDetail = await db.OrderDetail.findAll({
          where: { orderId: orders[j].id },
        });
        for (let k = 0; k < orderDetail.length; k++) {
          const productSize = await db.ProductSize.findOne({
            where: { id: orderDetail[k].productId },
            include: [{ model: db.AllCode, as: "sizeData" }],
            raw: true,
            nest: true,
          });
          orderDetail[k].productSize = productSize;
          orderDetail[k].productDetail = await db.ProductDetail.findOne({
            where: { id: productSize.productDetailId },
          });
          orderDetail[k].product = await db.Product.findOne({
            where: { id: orderDetail[k].productDetail.productId },
          });
          const productImages = await db.ProductImage.findAll({
            where: { productDetailId: orderDetail[k].productDetail.id },
          });
          orderDetail[k].productImage = productImages;
        }
        orders[j].orderDetail = orderDetail;
      }
      result.push({ addressUser: addressUsers[i], orders: orders });
    }
    return {
      result: result,
      statusCode: 0,
      errors: ["Retrieved all orders by user successfully!"],
    };
  } catch (error) {
    console.error("Errors", error);
    return errorResponse(error.message);
  }
};

const paymentOrderVNPay = async (req) => {
  try {
    var ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    console.log("vnp_IpAddr", ipAddr);
    var tmnCode = process.env.VNP_TMNCODE;
    var secretKey = process.env.VNP_HASHSECRET;
    var vnpUrl = process.env.VNP_URL;
    var returnUrl = process.env.VNP_RETURNURL;
    var createDate = process.env.DATE_VNPAYMENT;
    var orderId = uuidv4();
    console.log("createDate", createDate);
    console.log("orderId", orderId);
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    var orderInfo = req.body.orderDescription;
    var orderType = req.body.orderType;
    var locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }
    vnp_Params = sortObject(vnp_Params);
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    console.log("vnp_SecureHash", signed);
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    console.log(vnpUrl);
    return {
      result: [vnpUrl],
      statusCode: 200,
      errors: ["Success!"],
    };
  } catch (error) {
    console.error("Error:", error);
    return errorResponse(error.message);
  }
};

const confirmOrderVNPay = async (data) => {
  try {
    var vnp_Params = data;
    var secureHash = vnp_Params["vnp_SecureHash"];
    console.log("secureHash", secureHash);
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = sortObject(vnp_Params);
    var tmnCode = process.env.VNP_TMNCODE;
    var secretKey = process.env.VNP_HASHSECRET;
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    console.log("signed", signed);
    if (secureHash === signed) {
      return {
        result: [],
        statusCode: 0,
        errors: ["Confirm payment by VNPay successfully!"],
      };
    } else {
      return {
        result: [],
        statusCode: 1,
        errors: ["Failed payment by VNPay"],
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return errorResponse(error.message);
  }
};

const paymentOrderVNPaySuccess = async (data) => {
  try {
    let product = await db.Order.create({
      addressUserId: data.addressUserId,
      isPaymentOnline: data.isPaymentOnline,
      statusId: "S3",
      typeShipId: data.typeShipId,
      voucherId: data.voucherId,
      note: data.note,
    });
    data.arrDataShopCart = data.arrDataShopCart.map((item, index) => {
      item.orderId = product.dataValues.id;
      return item;
    });
    await db.OrderDetail.bulkCreate(data.arrDataShopCart);
    let res = await db.ShopCart.findOne({
      where: { userId: data.userId, statusId: 0 },
    });
    if (res) {
      await db.ShopCart.destroy({
        where: { userId: data.userId },
      });
      for (let i = 0; i < data.arrDataShopCart.length; i++) {
        let productDetailSize = await db.ProductDetailSize.findOne({
          where: { id: data.arrDataShopCart[i].productId },
          raw: false,
        });
        productDetailSize.stock =
          productDetailSize.stock - data.arrDataShopCart[i].quantity;
        await productDetailSize.save();
      }
    }
    if (data.voucherId && data.userId) {
      let voucherUses = await db.VoucherUsed.findOne({
        where: {
          voucherId: data.voucherId,
          userId: data.userId,
        },
        raw: false,
      });
      voucherUses.status = 1;
      await voucherUses.save();
    }
    return successResponse("Payment by VNPay");
  } catch (error) {
    console.error("Error:", error);
    return errorResponse(error.message);
  }
};

const confirmOrder = async (data) => {
  try {
    if (!data.orderId || !data.statusId) {
      return missingRequiredParams("orderId, statusId are");
    }
    const Order = await db.Order.findOne({
      where: { id: data.orderId },
      raw: false,
    });
    Order.statusId = data.statusId;
    await Order.save();
    return successResponse("Confirm");
  } catch (error) {
    console.log("Errors", error);
    return errorResponse(error.message);
  }
};

const getAllOrdersByShipper = async (shipperId, status) => {
  try {
    if (!shipperId) {
      return missingRequiredParams("shipperId is");
    }
    let objectFilter = {
      include: [
        { model: db.TypeShip, as: "typeShipData" },
        { model: db.Voucher, as: "voucherData" },
        { model: db.AllCode, as: "statusOrderData" },
      ],
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
      where: { shipperId: shipperId },
    };
    if (status === "working") {
      objectFilter.where = { ...objectFilter.where, statusId: "S5" };
    } else if (status === "done") {
      objectFilter.where = { ...objectFilter.where, statusId: "S6" };
    }
    const orders = await db.Order.findAll(objectFilter);
    for (let i = 0; i < orders.length; i++) {
      const addressUser = await db.AddressUser.findOne({
        where: { id: orders[i].addressUserId },
      });
      if (addressUser) {
        const user = await db.User.findOne({
          where: { id: addressUser.userId },
        });
        orders[i].userData = user;
        orders[i].addressUser = addressUser;
      }
    }
    return {
      result: orders,
      statusCode: 200,
      errors: ["Retrieved all orders by shipper successfully!"],
    };
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateStatusOrder,
  getAllOrdersByUser,
  paymentOrderVNPay,
  confirmOrderVNPay,
  paymentOrderVNPaySuccess,
  confirmOrder,
  getAllOrdersByShipper,
  sortObject,
};
