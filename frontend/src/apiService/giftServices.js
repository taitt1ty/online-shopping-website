import * as request from "@/utils/request";

export const gift = async () => {
  try {
    const res = await request.get("childrens/2");
    return res;
  } catch (error) {
    console.log(error);
  }
};
