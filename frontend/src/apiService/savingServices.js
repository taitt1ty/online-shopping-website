import * as request from "@/utils/request";
import * as req_json from "@/utils/request";

//fixed
export const saving = async () => {
  try {
    const res = await request.get("setting/sections/4");
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log("This is error in savingService.saving: ", error);
  }
};

export const feedback = async (id) => {
  const res = await request.get(`setting/feedback/${id}`);
  const resultObject = JSON.parse(res);
  return resultObject;
};

//Nếu trong object cần nhận từ bên ngoài vào thì để 2 tham số vào
//ở sync()
//fixed
export const gift = async () => {
  try {
    const res = await request.get("setting/sections/5");
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log(error);
  }
};

//fixed
export const slide = async () => {
  try {
    const res = await request.get("setting/slide");
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log(error);
  }
};

export const product = async () => {
  try {
    const res = await request.get("/product/list");
    return res;
  } catch (error) {
    console.log(error);
  }
};

//fixed
export const about = async () => {
  try {
    const res = await request.get("setting/about");
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log(error);
  }
};

//fixed
export const help = async () => {
  try {
    const res = await request.get("setting/help");
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log(error);
  }
};

//fixed
export const contact = async () => {
  try {
    const res = await request.get("setting/contact");
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log(error);
  }
};

//fixed
export const listProducts = async (perPage, page) => {
  try {
    //  const res = await request.get(`products?_limit=${perPage}&_page=${page}`);
    const res = await request.get(
      `product/pagination?limit=${perPage}&page=${page}`
    );
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log(error);
  }
};

//fixed
export const eachProduct = async (id) => {
  try {
    const res = await request.get(`product/${id}`);
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log(error);
  }
};

//fixed
export const getCustomerCart = async (customerId) => {
  try {
    const res = await request.get(`cart/customer-cart/${customerId}`);
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log(error);
  }
};

//getcartid by customerid
export const getCartIdByCustomerId = async (customerId) => {
  const res = await request.get(`cart/getCartId/${customerId}`);
  const resultObject = JSON.parse(res);
  return resultObject;
};

//POST item to cart --- new
export const addItemToCart = async (cartId, productId, quantity) => {
  const res = await request.post(`cart/add-item?cartId=${cartId}&productId=${productId}&quantity=${quantity}`);
  const resultObject = res;
  return resultObject;
}

export const getListAccounts = async () => {
  try {
    const res = await req_json.get_json("listAccounts");
    return res;
  } catch (error) {
    console.log(error);
  }
};

//new add
export const checkLogin = async (username, password) => {
  try {
    console.log("This username: ", username);
    console.log("This pass: ", password);
    const res = await request.get(
      `customer/login?username=${username}&password=${password}`
    );
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log(error);
  }
};

export const getInfoDelivery = async (customerId) => {
  try {
    const res = await request.get(`delivery/info/${customerId}`);
    const resultObject = JSON.parse(res);
    return resultObject;
  } catch (error) {
    console.log(error);
  }
};

export const getOrderDetail = async (customerId) => {
  try {
    const res = await request.get(`listOrders/${customerId}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};
//////POST
//Nếu KH chưa có trong addOrder
export const addOrder = async (info) => {
  try {
    const res = await request.post("listOrders", info);
    return res;
  } catch (error) {
    console.log(error);
  }
};
//Nếu KH đã có trong Order
export const hasOrder = async (info, customerId) => {
  try {
    const res = await request.post(`listOrders/${customerId}`, info);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addListAcc = async (newAccountData) => {
  try {
    const res = await request.post("listAccounts", newAccountData);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addCustomerCart = async (newCart) => {
  try {
    const res = await request.post("customerCarts", newCart);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addProductToCart = async (product) => {
  try {
    const res = await request.post("customerCarts", product);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const infoDeliveryOrder = async (info) => {
  try {
    const tempp = JSON.parse(localStorage.getItem("idCustomer"));
    const res = await request.post(`infoDelivery/${tempp}`, info);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const infoDeliveryOrderNone = async (info) => {
  try {
    // const tempp = JSON.parse(localStorage.getItem("idCustomer"));
    const res = await request.post("infoDelivery", info);
    return res;
  } catch (error) {
    console.log(error);
  }
};
//PUT
export const addToCart = async (data) => {
  try {
    const tempp = JSON.parse(localStorage.getItem("idCustomer"));
    const res = await request.put(`customerCarts/${tempp}`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};


//PATCH
export const updateCartCustomer = async (data, customerId) => {
  try {
    const res = await request.patch(`customerCarts/${customerId}/cart`, {
      cart: data,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//DELETE
// DELETE
export const deleteCart = async (cartId, productId) => {
  try {
    const res = await request.remove(`cart/remove?cartId=${cartId}&productId=${productId}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteInfoDelivery = async (customerId) => {
  try {
    const res = await request.remove(`infoDelivery/${customerId}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteOrderDetail = async (customerId) => {
  try {
    const res = await request.remove(`listOrders/${customerId}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};
