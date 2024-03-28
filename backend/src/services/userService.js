import db from "../models";
import bcrypt from "bcryptjs";
import CommonUtils from '../utils/CommonUtils';
require('dotenv').config();

const hashUserPassword = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const checkUserPhoneNumber = async (userPhoneNumber) => {
    const user = await db.User.findOne({ where: { phoneNumber: userPhoneNumber } });
    return !!user;
};

const handleCreateNewUser = async (data) => {
    try {
        if (!data.phoneNumber) {
            return {
                errCode: 2,
                errMessage: 'Missing required parameters!'
            };
        }

        const isExist = await checkUserPhoneNumber(data.phoneNumber);
        if (isExist) {
            return {
                errCode: 1,
                errMessage: "Số điện thoại đã được sử dụng!"
            };
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
            userToken: '',
        });

        return {
            errCode: 0,
            message: 'OK'
        };
    } catch (error) {
        console.log(error);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        };
    }
};

const deleteUser = async (userId) => {
    try {
        if (!userId) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters!'
            };
        }

        const foundUser = await db.User.findOne({ where: { id: userId } });
        if (!foundUser) {
            return {
                errCode: 2,
                errMessage: `Người dùng không tồn tại!`
            };
        }

        await db.User.destroy({ where: { id: userId } });

        return {
            errCode: 0,
            message: 'Đã xóa người dùng'
        };
    } catch (error) {
        console.log(error);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        };
    }
};

const updateUser = async (data) => {
    try {
        if (!data.id) {
            return {
                errCode: 2,
                errMessage: 'Missing required parameters'
            };
        }

        let user = await db.User.findOne({ where: { id: data.id } });
        if (!user) {
            return {
                errCode: 1,
                errMessage: 'Không tìm thấy người dùng!'
            };
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

        return {
            errCode: 0,
            errMessage: "Cập nhật người dùng thành công!"
        };
    } catch (error) {
        console.log(error);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        };
    }
};

const handleLogin = async (data) => {
    try {
        if (!data.phoneNumber || !data.password) {
            return {
                errCode: 4,
                errMessage: 'Missing required parameters!'
            };
        }

        let userData = {};
        let isExist = await checkUserPhoneNumber(data.phoneNumber);
        if (!isExist) {
            return {
                errCode: 1,
                errMessage: 'Số điện thoại không tồn tại trong hệ thống!'
            };
        }

        let user = await db.User.findOne({
            attributes: ['email', 'roleId', 'password', 'fullName', 'id'],
            where: { phoneNumber: data.phoneNumber, statusId: 'S1' }
        });
        if (!user) {
            return {
                errCode: 2,
                errMessage: 'Người dùng không tồn tại'
            };
        }

        let check = bcrypt.compareSync(data.password, user.password);
        if (!check) {
            return {
                errCode: 3,
                errMessage: 'Sai mật khẩu'
            };
        }

        delete user.password;
        userData.errCode = 0;
        userData.errMessage = 'OK';
        userData.user = user;
        //import CommonUtil to use encodeToken
        userData.accessToken = CommonUtils.encodeToken(user.id);

        return userData;
    } catch (error) {
        console.log(error);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        };
    }
};

const getAllUser = async (data) => {
    try {
        let objectFilter = {
            where: { status_id: 'S1' },
            attributes: {
                exclude: ['password', 'image']
            },
            include: [
                { model: db.AllCode, as: 'role_data', attributes: ['value', 'code'] }
            ],
            raw: true,
            nest: true
        };

        if (data.limit && data.offset) {
            objectFilter.limit = +data.limit;
            objectFilter.offset = +data.offset;
        }
    } catch (error) {
        console.log(error);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        };
    }
};

const getUserById = async (userId) => {
    try {
        if (!userId) {
            return {
                errCode: 1,
                errMessage: "Missing required parameters!"
            };
        }

        let res = await db.User.findOne({
            where: { id: userId, status_id: 'S1' },
            attributes: {
                exclude: ['password']
            },
            include: [
                { model: db.AllCode, as: 'role_data', attributes: ['value', 'code'] }
            ],
            raw: true,
            nest: true
        });

        if (res.image) {
            res.image = new Buffer(res.image, 'base64').toString('binary');
        }

        return {
            errCode: 0,
            data: res
        };
    } catch (error) {
        console.log(error);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        };
    }
};

module.exports = {
    handleCreateNewUser: handleCreateNewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    handleLogin: handleLogin,
    getAllUser: getAllUser,
    getUserById: getUserById,
    checkUserPhoneNumber: checkUserPhoneNumber
}
