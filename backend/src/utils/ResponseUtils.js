const success = 200;
const errors = [400, 500, 404];
//500: Internal Server Error
//400: Bad Request, used when the request is invalid from the client.
//404: Not Found
//403: Forbidden, used when the user does not have access to the resource.

const respFunction = (result, statusCode, errors) => {
    return {
        result: result,
        statusCode: statusCode,
        errors: errors
    };
};

const errorResponse = () => {
    return respFunction([], 500, 'Error from server!');
};

const missingRequiredParams = (fieldName) => {
    return respFunction([], 400, `${fieldName} is required!`);
};

const userNotExist = () => {
    return respFunction([], 404, `User doesn't exist!`);
};

const successResponse = () => {
    return respFunction([], 200, 'OK');
};

module.exports = {
    success,
    errors,
    respFunction,
    errorResponse,
    missingRequiredParams,
    userNotExist,
    successResponse
};
