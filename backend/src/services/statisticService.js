const { Op } = require("sequelize");
import db from "../models/index";
import moment from "moment";
import {
  errorResponse,
  missingRequiredParams,
  notFound,
  successResponse,
} from "../utils/ResponseUtils";
function compareDates(d1, d2) {
  //  bigger is false
  //  smaller is true
  var parts = d1.split("/");
  var d1 = Number(parts[2] + parts[1] + parts[0]);
  parts = d2.split("/");
  var d2 = Number(parts[2] + parts[1] + parts[0]);
  if (d1 <= d2) return true;
  if (d1 >= d2) return false;
}
const getCountCardStatistic = async () => {
  try {
    let countUser = await db.User.count({ where: { statusId: "S1" } });
    let countProduct = await db.Product.count();
    // let countReview = await db.Comment.count({
    //   where: {
    //     star: { [Op.gt]: 0 },
    //   },
    // });
    let countOrder = await db.Order.count({
      where: {
        statusId: { [Op.ne]: "S7" },
      },
    });
    let data = {
      countUser,
      countProduct,
      //   countReview,
      countOrder,
    };
    return {
      result: [data],
      statusCode: 200,
      errors: ["Count card successfully!"],
    };
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

const getCountStatusOrder = async (data) => {
  try {
    if (!data.oneDate && !data.twoDate) {
      return missingRequiredParams();
    } else {
      const statusOrder = await db.AllCode.findAll({
        where: { type: "STATUS-ORDER" },
      });

      if (statusOrder.length === 0) {
        return notFound("status order");
      }
      const orderProduct = await db.Order.findAll();
      const filteredOrderProduct = orderProduct.filter((item) => {
        if (data.type === "day") {
          const updatedAt = moment(item.updatedAt).format("YYYYMMDD");
          const twoDate = moment(data.twoDate).format("YYYYMMDD");
          const oneDate = moment(data.oneDate).format("YYYYMMDD");
          return updatedAt >= oneDate && updatedAt <= twoDate;
        } else if (data.type === "month") {
          const updatedAtMonth = moment(item.updatedAt).format("YYYY-MM");
          const oneMonth = moment(data.oneDate).format("YYYY-MM");
          return updatedAtMonth === oneMonth;
        } else {
          const updatedAtYear = moment(item.updatedAt).format("YYYY");
          const oneYear = moment(data.oneDate).format("YYYY");
          return updatedAtYear === oneYear;
        }
      });
      const objectCount = {
        arrayLabel: [],
        arrayValue: [],
      };
      for (let i = 0; i < statusOrder.length; i++) {
        const label = statusOrder[i].value;
        const value = filteredOrderProduct.filter(
          (item) => item.statusId === statusOrder[i].code
        ).length;
        objectCount.arrayLabel.push(label);
        objectCount.arrayValue.push(value);
      }
      return {
        result: [objectCount],
        statusCode: 200,
        errors: ["Count status order successfully!"],
      };
    }
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

const totalPriceDiscount = (price, discount) => {
  const voucherData = discount.voucherData.typeVoucherOfVoucherData;
  if (voucherData.typeVoucher === "percent") {
    const discountAmount = (price * voucherData.value) / 100;
    const maxDiscount = voucherData.maxValue;
    return price - Math.min(discountAmount, maxDiscount);
  } else {
    return price - voucherData.maxValue;
  }
};

function DaysOfMonth(thang, nam) {
  var mon = parseInt(thang, 10);
  var yar = parseInt(nam, 10);
  switch (mon) {
    case 2:
      if (yar % 4 == 0 && yar % 400 != 0) return 29;
      else return 28;
      break;
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
      break;
    default:
      return 30;
  }
}

const getStatisticByMonth = async (data) => {
  try {
    if (!data.year) {
      return missingRequiredParams();
    } else {
      const orders = await db.Order.findAll({
        where: { statusId: "S6" },
        include: [
          { model: db.TypeShip, as: "typeShipData" },
          { model: db.Voucher, as: "voucherData" },
          { model: db.AllCode, as: "statusOrderData" },
        ],
        raw: true,
        nest: true,
      });
      const arrayMonthLable = [];
      const arrayMonthValue = new Array(12).fill(0);
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const updatedAt = moment(order.updatedAt);
        if (updatedAt.format("YYYY") === data.year && updatedAt.isValid()) {
          const orderDetails = await db.OrderDetail.findAll({
            where: { orderId: order.id },
          });
          let totalPriceProduct = 0;
          for (let j = 0; j < orderDetails.length; j++) {
            const orderDetail = orderDetails[j];
            totalPriceProduct += orderDetail.realPrice * orderDetail.quantity;
          }
          if (order.voucherId) {
            totalPriceProduct =
              totalPriceDiscount(totalPriceProduct, order) +
              order.typeShipData.price;
          } else {
            totalPriceProduct += order.typeShipData.price;
          }
          const monthIndex = updatedAt.month();
          arrayMonthValue[monthIndex] += totalPriceProduct;
        }
      }
      for (let i = 0; i < 12; i++) {
        arrayMonthLable.push(`Thang ${i + 1}`);
      }
      return {
        result: [
          {
            arrayMonthLable,
            arrayMonthValue,
          },
        ],
        statusCode: 200,
        errors: ["Statistic by month successfully!"],
      };
    }
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const getStatisticByDay = async (data) => {
  try {
    if (!data.month || !data.year) {
      return missingRequiredParams();
    } else {
      const day = DaysOfMonth(data.month, data.year);

      const orderProducts = await db.Order.findAll({
        where: { statusId: "S6" },
        include: [
          { model: db.TypeShip, as: "typeShipData" },
          { model: db.Voucher, as: "voucherData" },
          { model: db.AllCode, as: "statusOrderData" },
        ],
        raw: true,
        nest: true,
      });

      const arrayDayLable = [];
      const arrayDayValue = [];

      for (let i = 1; i <= day; i++) {
        const isToday =
          +moment(new Date()).format("DD") === i &&
          data.year === moment(new Date()).format("YYYY") &&
          data.month === moment(new Date()).format("M");
        arrayDayLable.push(isToday ? "Today" : i);
        let price = 0;
        for (let j = 0; j < orderProducts.length; j++) {
          const orderProduct = orderProducts[j];
          const updatedAt = moment(orderProduct.updatedAt);
          if (
            updatedAt.format("YYYY") === data.year &&
            updatedAt.format("M") === data.month &&
            +updatedAt.format("DD") === i
          ) {
            let totalprice = 0;
            for (let k = 0; k < orderProduct.orderDetail.length; k++) {
              const orderDetail = orderProduct.orderDetail[k];
              totalprice += orderDetail.realPrice * orderDetail.quantity;
            }
            if (orderProduct.voucherId) {
              totalprice =
                totalPriceDiscount(totalprice, orderProduct) +
                orderProduct.typeShipData.price;
            } else {
              totalprice += orderProduct.typeShipData.price;
            }
            price += totalprice;
          }
        }
        arrayDayValue.push(price);
      }
      return {
        result: [
          {
            arrayDayLable,
            arrayDayValue,
          },
        ],
        statusCode: 200,
        errors: ["Statistic by day successfully!"],
      };
    }
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
};

const getStatisticProfit = async (data) => {
  try {
    if (!data.oneDate || !data.twoDate) {
      return errorResponse();
    }
    let orderProducts = await db.Order.findAll({
      where: { statusId: "S6" },
      include: [
        { model: db.TypeShip, as: "typeShipData" },
        {
          model: db.Voucher,
          as: "voucherData",
          include: [{ model: db.TypeVoucher, as: "typeVoucherOfVoucherData" }],
        },
        { model: db.AllCode, as: "statusOrderData" },
      ],
      raw: true,
      nest: true,
    });
    for (let orderProduct of orderProducts) {
      let totalprice = 0;
      let importPrice = 0;
      for (let orderDetail of orderProduct.orderDetail) {
        let avgPrice = 0;
        let avgQuantity = 0;
        for (let receiptDetail of orderDetail.receiptDetails) {
          avgPrice += receiptDetail.quantity * receiptDetail.price;
          avgQuantity += receiptDetail.quantity;
        }
        orderDetail.importPrice = Math.round(avgPrice / avgQuantity);
        importPrice +=
          Math.round(avgPrice / avgQuantity) * orderDetail.quantity;
        totalprice += orderDetail.realPrice * orderDetail.quantity;
      }
      orderProduct.importPrice = importPrice;
      if (orderProduct.voucherId) {
        orderProduct.totalpriceProduct =
          totalPriceDiscount(totalprice, orderProduct) +
          orderProduct.typeShipData.price;
        orderProduct.profitPrice =
          totalPriceDiscount(totalprice, orderProduct) +
          orderProduct.typeShipData.price -
          importPrice;
      } else {
        orderProduct.totalpriceProduct =
          totalprice + orderProduct.typeShipData.price;
        orderProduct.profitPrice =
          totalprice + orderProduct.typeShipData.price - importPrice;
      }
    }
    let filetOrderProduct = orderProducts.filter((item) => {
      let updatedAt = moment.utc(item.updatedAt).local().format("YYYYMMDD");
      let oneDate = moment(data.oneDate).format("YYYYMMDD");
      let twoDate = moment(data.twoDate).format("YYYYMMDD");
      if (data.type === "day") {
        return updatedAt >= oneDate && updatedAt <= twoDate;
      } else if (data.type === "month") {
        return (
          moment.utc(item.updatedAt).local().format("YYYYMM") ===
          moment(data.oneDate).format("YYYYMM")
        );
      } else {
        return (
          moment.utc(item.updatedAt).local().format("YYYY") ===
          moment(data.oneDate).format("YYYY")
        );
      }
    });
    return {
      result: [filetOrderProduct],
      statusCode: 200,
      errors: ["Success"],
    };
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

const getStatisticOverturn = async (data) => {
  try {
    if (!data.oneDate || !data.twoDate) {
      return errorResponse();
    }

    let orderProducts = await db.Order.findAll({
      where: { statusId: "S6" },
      include: [
        { model: db.TypeShip, as: "typeShipData" },
        { model: db.Voucher, as: "voucherData" },
        { model: db.AllCode, as: "statusOrderData" },
      ],
      raw: true,
      nest: true,
    });
    for (let orderProduct of orderProducts) {
      let totalprice = 0;
      for (let orderDetail of orderProduct.orderDetail) {
        totalprice += orderDetail.realPrice * orderDetail.quantity;
      }
      if (orderProduct.voucherId) {
        orderProduct.totalpriceProduct =
          totalPriceDiscount(totalprice, orderProduct) +
          orderProduct.typeShipData.price;
      } else {
        orderProduct.totalpriceProduct =
          totalprice + orderProduct.typeShipData.price;
      }
    }
    orderProducts = orderProducts.filter((item) => {
      let updatedAt = moment.utc(item.updatedAt).local().format("YYYYMMDD");
      let oneDate = moment(data.oneDate).format("YYYYMMDD");
      let twoDate = moment(data.twoDate).format("YYYYMMDD");
      if (data.type === "day") {
        return updatedAt >= oneDate && updatedAt <= twoDate;
      } else if (data.type === "month") {
        return (
          moment.utc(item.updatedAt).local().format("YYYYMM") ===
          moment(data.oneDate).format("YYYYMM")
        );
      } else {
        return (
          moment.utc(item.updatedAt).local().format("YYYY") ===
          moment(data.oneDate).format("YYYY")
        );
      }
    });
    return {
      result: [orderProducts],
      statusCode: 200,
      errors: ["Success"],
    };
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

const getStatisticStockProduct = async (data) => {
  try {
    let objectFilter = {
      include: [
        {
          model: db.AllCode,
          as: "sizeData",
          attributes: ["value", "code"],
        },
      ],
      raw: true,
      nest: true,
    };
    if (data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }
    let res = await db.ProductSize.findAndCountAll(objectFilter);
    for (let productDetail of res.rows) {
      let quantity = 0;
      let receiptDetails = await db.ReceiptDetail.findAll({
        where: { sizeId: productDetail.id },
      });
      for (let receiptDetail of receiptDetails) {
        quantity += receiptDetail.quantity;
      }
      let orderDetails = await db.OrderDetail.findAll({
        where: { productId: productDetail.id },
      });
      for (let orderDetail of orderDetails) {
        let order = await db.Order.findOne({
          where: { id: orderDetail.orderId },
          attributes: ["statusId"],
        });
        if (order && order.statusId !== "S7") {
          quantity -= orderDetail.quantity;
        }
      }
      productDetail.productDetailData = await db.ProductDetail.findOne({
        where: { id: productDetail.productDetailId },
      });
      productDetail.productData = await db.Product.findOne({
        where: { id: productDetail.productDetailData.productId },
        include: [
          {
            model: db.AllCode,
            as: "brandData",
            attributes: ["value", "code"],
          },
          {
            model: db.AllCode,
            as: "categoryData",
            attributes: ["value", "code"],
          },
          {
            model: db.AllCode,
            as: "statusData",
            attributes: ["value", "code"],
          },
        ],
        raw: true,
        nest: true,
      });
      productDetail.stock = quantity;
    }
    return {
      result: res.rows,
      statusCode: 200,
      errors: ["Success"],
    };
  } catch (error) {
    console.log(error);
    return errorResponse(error.message);
  }
};

export default {
  getCountCardStatistic,
  getCountStatusOrder,
  getStatisticByMonth,
  getStatisticByDay,
  getStatisticOverturn,
  getStatisticProfit,
  getStatisticStockProduct,
};
