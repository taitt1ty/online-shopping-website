import axios from "axios";
const request = axios.create({
  baseURL: "http://localhost:3001/",
});
const req_json = axios.create({
  baseURL: "http://localhost:3000/",
});
export const get = async (path, options = {}) => {
  try {
    const response = await request.get(path, options);
    return JSON.stringify(response.data);
  } catch (error) {
    console.log("This is error in request: ", error);
  }
};

//for json
export const get_json = async (path, options = {}) => {
  try {
    const response = await req_json.get(path, options);
    return JSON.stringify(response.data);
  } catch (error) {
    console.log("This is error in request: ", error);
  }
};

//POST ACCOUNT
export const post = async (path, data = {}, options = {}) => {
  try {
    const response = await request.post(path, data, options);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thực hiện yêu cầu POST:", error);
    throw error;
  }
};

export const patch = async (path, data = {}, options = {}) => {
  try {
    const response = await request.patch(path, { data }, options);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thực hiện yêu cầu PATCH:", error);
    throw error;
  }
};
//PUT CART
export const put = async (path, data = {}, options = {}) => {
  try {
    const response = await request.put(path, data, options);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thực hiện yêu cầu PUT:", error);
    throw error;
  }
};

//DELETE
export const remove = async (path, options = {}) => {
  try {
    const response = await request.delete(path, options);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thực hiện yêu cầu DELETE:", error);
    throw error;
  }
};

export default request;
