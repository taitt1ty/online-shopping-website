import db from "../models";
import bcrypt from "bcryptjs";
import CommonUtils from "../utils/CommonUtils";
import {
  successResponse,
  errorResponse,
  missingRequiredParams,
  userNotExist,
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

const registerUser = async (data) => {
  try {
    if (!data.phoneNumber) {
      return missingRequiredParams("phoneNumber");
    }

    const isExist = await checkUserPhoneNumber(data.phoneNumber);
    if (isExist) {
      return errorResponse(`User already exists`);
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

    return successResponse("User registration");
  } catch (error) {
    console.log(error);
    return errorResponse();
  }
};

const loginUser = async (data) => {
  try {
    if (!data.phoneNumber || !data.password) {
      return missingRequiredParams("phoneNumber or password");
    }
    const isExist = await checkUserPhoneNumber(data.phoneNumber);
    if (!isExist) {
      return userNotExist();
    }
    const user = await db.User.findOne({
      attributes: ["email", "roleId", "password", "fullName", "id"],
      where: { phoneNumber: data.phoneNumber, statusId: "S1" },
    });

    if (!user) {
      return userNotExist();
    }
    let check = await bcrypt.compare(data.password, user.password);
    if (!check) {
      return {
        result: [],
        statusCode: 401,
        errMessage: ["Wrong password!"],
      };
    }
    // Delete password before return information of user
    delete user.password;
    const accessToken = CommonUtils.encodeToken(user.id);
    return {
      result: [accessToken],
      statusCode: 200,
      errMessage: ["Login successful"],
    };
  } catch (error) {
    console.error("Error in login:", error);
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
      return userNotExist();
    }

    await db.User.destroy({ where: { id: userId } });

    return successResponse("Deleted user");
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
      return userNotExist();
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

    return successResponse("Updated user");
  } catch (error) {
    console.log(error);
    return errorResponse();
  }
};

const getAllUser = async (data) => {
  try {
    let objectFilter = {
      where: { statusId: "S1" },
      attributes: {
        exclude: ["password", "image"],
      },
      include: [
        { model: db.AllCode, as: "roleData", attributes: ["value", "code"] },
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

    let user = await db.User.findOne({
      where: { id: userId, statusId: "S1" },
      attributes: { exclude: ["password"] },
      include: [
        { model: db.AllCode, as: "roleData", attributes: ["value", "code"] },
      ],
    });

    if (!user) {
      return userNotExist();
    }

    if (user.image) {
      user.image = new Buffer(user.image, "base64").toString("binary");
    }

    return successResponse(user);
  } catch (error) {
    console.error("Error in getUserById:", error);
    return errorResponse();
  }
};

const changePassword = async (data) => {
  try {
    if (!data.id || !data.password || !data.oldpassword) {
      return missingRequiredParams("id, password, or oldpassword");
    }

    let user = await db.User.findOne({
      where: { id: data.id },
      raw: false,
    });

    if (!user) {
      return userNotExist();
    }

    const isMatch = await bcrypt.compare(data.oldpassword, user.password);
    if (!isMatch) {
      return {
        errCode: 2,
        errMessage: "Old password is wrong!",
      };
    }

    user.password = await hashUserPassword(data.password);
    await user.save();

    return successResponse("Change password");
  } catch (error) {
    console.error("Error in changePassword:", error);
    return errorResponse();
  }
};

export default {
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  getAllUser,
  getUserById,
  checkUserPhoneNumber,
  changePassword,
};
