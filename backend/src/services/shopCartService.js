import db from "../models/index";
import {
  successResponse,
  errorResponse,
  missingRequiredParams,
} from "../utils/ResponseUtils";

const addShopCart = async (data) => {
  try {
    if (!data.userId || !data.sizeId || !data.quantity) {
      return missingRequiredParams("user, size, quantity are");
    }
    // Function to calculate available stock
    const calculateStock = async (sizeId) => {
      try {
        let receiptDetail = await db.ReceiptDetail.findAll({
          where: { sizeId },
        });
        // let orderDetail = await db.OrderDetail.findAll({
        //   where: { productId: sizeId },
        // });
        let quantity = 0;

        for (let j = 0; j < receiptDetail.length; j++) {
          quantity += receiptDetail[j].quantity;
        }

        // for (let k = 0; k < orderDetail.length; k++) {
        //   let order = await db.Order.findOne({
        //     where: { id: orderDetail[k].orderId },
        //   });
        //   if (order && order.statusId != "S7") {
        //     quantity -= orderDetail[k].quantity;
        //   }
        // }
        return quantity;
      } catch (err) {
        console.error("Error calculating stock:", err);
        throw new Error("Error calculating stock");
      }
    };
    // Check if the cart already exists
    // const cart = await db.ShopCart.findOne({
    //   where: { userId: data.userId, sizeId: data.sizeId, statusId: 0 },
    //   raw: false,
    // });
    // Check stock availability
    const stock = await calculateStock(data.sizeId);
    // if (cart) {
    //   if (data.type === "UPDATE_QUANTITY") {
        if (+data.quantity > stock) {
          return errorResponse(`Chỉ còn ${stock} sản phẩm`, 2, stock);
    //     } else {
    //       cart.quantity = +data.quantity;
    //       await cart.save();
    //     }
    //   } else {
    //     if (+cart.quantity + +data.quantity > stock) {
    //       return errorResponse(`Chỉ còn ${stock} sản phẩm`, 2, stock);
    //     } else {
    //       cart.quantity += +data.quantity;
    //       await cart.save();
    //     }
    //   }
    } else {
      if (data.quantity > stock) {
        return errorResponse(`Chỉ còn ${stock} sản phẩm`, 2, stock);
      } else {
        await db.ShopCart.create({
          userId: data.userId,
          sizeId: data.sizeId,
          quantity: data.quantity,
          statusId: 0,
        });
      }
    }
    return successResponse("Add items into shop cart");
  } catch (error) {
    console.error("Error in addShopCart:", error);
    return errorResponse(error.message);
  }
};

const getShopCartByUserId = async (userId) => {
  try {
    if (!userId) {
      return errorResponse("Missing required parameter userId!");
    }
    const shopCartItems = await db.ShopCart.findAll({
      where: { userId: userId, statusId: 0 },
      raw: true,
    });
    if (!shopCartItems || shopCartItems.length === 0) {
      return errorResponse("No shop cart items found for the user!");
    }
    const data = [];
    for (const item of shopCartItems) {
      const productDetail = await db.ProductDetail.findOne({
        where: { id: item.sizeId },
        include: [
          {
            model: db.Product,
            as: "productData",
            attributes: ["name"],
          },
          {
            model: db.ProductImage,
            as: "productImageData",
            attributes: ["image"],
          },
          { model: db.ProductSize, as: "sizeData", attributes: ["sizeId"] },
        ],
        raw: true,
      });

      if (!productDetail) {
        continue;
      }
      const productImages = productDetail.productImageData;
      if (productImages) {
        const productImages = productImages.map(
          (productImage) => productImage.image
        );
      }
      data.push({
        id: item.id,
        userId: item.userId,
        sizeId: item.sizeId,
        sideData: productDetail["sizeData.sizeId"],
        quantity: item.quantity,
        productId: productDetail.productId,
        name: productDetail["productData.name"],
        image: productDetail["productImageData.image"],
        color: productDetail.color,
        originalPrice: productDetail.originalPrice,
        discountPrice: productDetail.discountPrice,
      });
    }
    return {
      result: data,
      statusCode: 200,
      errors: [`Get items with userId = ${userId} successfully!`],
    };
  } catch (error) {
    console.error("Error in getShopCartByUserId:", error);
    return errorResponse(error.message);
  }
};

const deleteItem = async (data) => {
  try {
    if (!data.id) {
      return errorResponse("Missing required parameter!");
    }
    const res = await db.ShopCart.findOne({
      where: { id: data.id, statusId: 0 },
    });
    if (res) {
      await db.ShopCart.destroy({ where: { id: data.id } });
      return successResponse("ok");
    }
  } catch (error) {
    console.error("Error in deleteItem:", error);
    return errorResponse("Failed to delete item from shop cart");
  }
};

export default { addShopCart, getShopCartByUserId, deleteItem };
