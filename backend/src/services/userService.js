import db from "../models";
import bcrypt from "bcryptjs";
import CommonUtils from "../utils/CommonUtils";
import {
  successResponse,
  errorResponse,
  missingRequiredParams,
} from "../utils/ResponseUtils";

require("dotenv").config();

const hashUserPassword = async (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const checkUserPhoneNumber = async (userPhoneNumber) => {
  const user = await db.User.findOne({
    where: { phoneNumber: userPhoneNumber },
  });
  return !!user;
};

const handleCreateNewUser = async (data) => {
  try {
    if (!data.phoneNumber) {
      return missingRequiredParams("phoneNumber");
    }

    const isExist = await checkUserPhoneNumber(data.phoneNumber);
    if (isExist) {
      return userExistsError();
    }

    const hashPassword = await hashUserPassword(data.password);
    await db.User.create({
      email: data.email,
      password: hashPassword,
      fullName: data.fullName,
      address: data.address,
      roleId: data.roleId,
      phoneNumber: data.phoneNumber,
      image: data.avatar,
      dob: data.dob,
      isActivePhone: 0,
      statusId: "S1",
      userToken: "",
    });

    return successResponse();
  } catch (error) {
    console.log(error);
    return errorResponse();
  }
};

const deleteUser = async (userId) => {
  try {
    if (!userId) {
      return missingRequiredParams("userId");
    }
    const foundUser = await db.User.findOne({ where: { id: userId } });
    if (!foundUser) {
      return userNotExistError();
    }

    await db.User.destroy({ where: { id: userId } });

    return successResponse("Đã xóa người dùng");
  } catch (error) {
    console.log(error);
    return errorResponse();
  }
};

const updateUser = async (data) => {
  try {
    if (!data.id) {
      return missingRequiredParams("userId");
    }

    let user = await db.User.findOne({ where: { id: data.id } });
    if (!user) {
      return userNotExistError();
    }

    user.fullName = data.fullName;
    user.address = data.address;
    user.roleId = data.roleId;
    user.phoneNumber = data.phoneNumber;
    user.dob = data.dob;
    if (data.image) {
      user.image = data.image;
    }

    await user.save();

    return successResponse("Cập nhật người dùng thành công!");
  } catch (error) {
    console.log(error);
    return errorResponse();
  }
};

const handleLogin = async (data) => {
  try {
    if (!data.phoneNumber || !data.password) {
      return missingRequiredParams("phoneNumber or password");
    }

    let userData = {};
    let isExist = await checkUserPhoneNumber(data.phoneNumber);
    if (!isExist) {
      return userNotExistError();
    }

    let user = await db.User.findOne({
      attributes: ["email", "roleId", "password", "fullName", "id"],
      where: { phoneNumber: data.phoneNumber, statusId: "S1" },
    });
    if (!user) {
      return userNotExistError();
    }

    let check = bcrypt.compareSync(data.password, user.password);
    if (!check) {
      return {
        errCode: 3,
        errMessage: "Sai mật khẩu",
      };
    }

    delete user.password;
    userData.errCode = 0;
    userData.errMessage = "OK";
    userData.user = user;
    //import CommonUtil to use encodeToken
    userData.accessToken = CommonUtils.encodeToken(user.id);

    return userData;
  } catch (error) {
    console.log(error);
    return errorResponse();
  }
};

const getAllUser = async (data) => {
  try {
    let objectFilter = {
      where: { status_id: "S1" },
      attributes: {
        exclude: ["password", "image"],
      },
      include: [
        { model: db.AllCode, as: "role_data", attributes: ["value", "code"] },
      ],
      raw: true,
      nest: true,
    };

    if (data.limit && data.offset) {
      objectFilter.limit = +data.limit;
      objectFilter.offset = +data.offset;
    }
  } catch (error) {
    console.log(error);
    return errorResponse();
  }
};

const getUserById = async (userId) => {
  try {
    if (!userId) {
      return missingRequiredParams("userId");
    }

    let res = await db.User.findOne({
      where: { id: userId, statusId: "S1" },
      attributes: {
        exclude: ["password"],
      },
      include: [
        { model: db.AllCode, as: "roleData", attributes: ["value", "code"] },
      ],
      raw: true,
      nest: true,
    });

    if (res.image) {
      res.image = new Buffer(res.image, "base64").toString("binary");
    }

    return successResponse(res);
  } catch (error) {
    console.log(error);
    return errorResponse();
  }
};

module.exports = {
  handleCreateNewUser: handleCreateNewUser,
  deleteUser: deleteUser,
  updateUser: updateUser,
  handleLogin: handleLogin,
  getAllUser: getAllUser,
  getUserById: getUserById,
  checkUserPhoneNumber: checkUserPhoneNumber,
};
