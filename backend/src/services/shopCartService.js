import db from "../models/index";
import { successResponse, errorResponse } from "../utils/ResponseUtils";

const addShopCart = async (data) => {
  try {
    if (!data.userId || !data.productSizeId || !data.quantity) {
      return errorResponse("Missing required parameter!");
    }

    const cart = await db.ShopCart.findOne({
      where: {
        userId: data.userId,
        productSizeId: data.productSizeId,
        statusId: 0,
      },
      raw: false,
    });

    if (cart) {
      // Find the product's inventory quantity
      let res = await db.ProductSize.findOne({
        where: { id: data.productSizeId },
      });
      if (res) {
        // Calculate inventory quantity based on invoice and purchase order details
        /*
        let receiptDetail = await db.ReceiptDetail.findAll({
          where: { productSizeId: res.id },
        });
        let orderDetail = await db.OrderDetail.findAll({
          where: { productId: res.id },
        });
        let quantity = 0;
        for (let j = 0; j < receiptDetail.length; j++) {
          quantity += receiptDetail[j].quantity;
        }
        for (let k = 0; k < orderDetail.length; k++) {
          let order = await db.OrderProduct.findOne({
            where: { id: orderDetail[k].orderId },
          });
          // Do not calculate quantities from unfulfilled orders
          if (order.statusId != "S7") {
            quantity -= orderDetail[k].quantity;
          }
        }
        res.stock = quantity;
        */
      }

      // Update or add new products to the cart
      if (data.type === "UPDATE_QUANTITY") {
        if (+data.quantity > res.stock) {
          return errorResponse(`Chỉ còn ${res.stock} sản phẩm`, 2, res.stock);
        } else {
          cart.quantity = +data.quantity;
          await cart.save();
        }
      } else {
        if (+cart.quantity + +data.quantity > res.stock) {
          return errorResponse(`Chỉ còn ${res.stock} sản phẩm`, 2, res.stock);
        } else {
          cart.quantity += +data.quantity;
          await cart.save();
        }
      }
    } else {
      // If the shopping cart does not exist, create a new shopping cart
      let res = await db.ProductSize.findOne({
        where: { id: data.productSizeId },
      });
      if (res) {
        // Calculate inventory quantity based on invoice and purchase order details
        /*
        let receiptDetail = await db.ReceiptDetail.findAll({
          where: { productSizeId: res.id },
        });
        let orderDetail = await db.OrderDetail.findAll({
          where: { productId: res.id },
        });
        let quantity = 0;
        for (let j = 0; j < receiptDetail.length; j++) {
          quantity += receiptDetail[j].quantity;
        }
        for (let k = 0; k < orderDetail.length; k++) {
          let order = await db.OrderProduct.findOne({
            where: { id: orderDetail[k].orderId },
          });
          if (order.statusId != "S7") {
            quantity -= orderDetail[k].quantity;
          }
        }
        res.stock = quantity;
        */

        // Check inventory and add new items to cart
        if (data.quantity > res.stock) {
          return errorResponse(`Chỉ còn ${res.stock} sản phẩm`, 2, res.stock);
        } else {
          await db.ShopCart.create({
            userId: data.userId,
            productSizeId: data.productSizeId,
            quantity: data.quantity,
            statusId: 0,
          });
        }
      }
    }

    return successResponse("Add items into shop cart");
  } catch (error) {
    console.error("Error in addShopCart:", error);
    return errorResponse("Failed to add shop cart");
  }
};

const getShopCartByUserId = async (id) => {
  try {
    if (!id) {
      return errorResponse("Missing required parameter !");
    }

    const shopCartItems = await db.ShopCart.findAll({
      where: { userId: id, statusId: 0 },
    });

    if (shopCartItems.length === 0) {
      return errorResponse("No shop cart items found for the user!");
    }

    const data = [];
    for (const item of shopCartItems) {
      const productDetail = await db.ProductDetail.findOne({
        where: { id: item.productSizeId },
        include: [
          {
            model: db.Product,
            as: "productData",
            include: [
              { model: db.AllCode, as: "categoryData" },
              { model: db.AllCode, as: "brandData" },
            ],
          },
          { model: db.ProductImage, as: "productImageData" },
          { model: db.ProductSize, as: "productSizeData" },
        ],
      });

      if (!productDetail) {
        continue;
      }

      const productImages = productDetail.productImageData.map(
        (image) => image.image
      );

      data.push({
        ...item.dataValues,
        productDetail,
        productImages,
      });
    }

    return {
      result: data,
      statusCode: 200,
      errors: [`Retrieved items userId = ${id} successfully!`],
    };
  } catch (error) {
    console.error("Error in getShopCartByUserId:", error);
    return errorResponse("Failed to get shop cart by user ID");
  }
};

const deleteItemShopCart = async (data) => {
  try {
    if (!data.id) {
      return errorResponse("Missing required parameter !");
    }

    const res = await db.ShopCart.findOne({
      where: { id: data.id, statusId: 0 },
    });
    if (res) {
      await db.ShopCart.destroy({ where: { id: data.id } });
      return successResponse("ok");
    }
  } catch (error) {
    console.error("Error in deleteItemShopCart:", error);
    return errorResponse("Failed to delete item from shop cart");
  }
};

export default { addShopCart, getShopCartByUserId, deleteItemShopCart };
