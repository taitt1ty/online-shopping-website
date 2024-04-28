const success = 200;
const errors = [500, 400, 404, 403];
//500: Internal Server Error
//400: Bad Request, used when the request is invalid from the client.
//404: Not Found
//403: Forbidden, used when the user does not have access to the resource.

const respFunction = (result, statusCode, errMessage) => {
  return {
    result: result,
    statusCode: statusCode,
    errors: errMessage,
  };
};

const errorResponse = (fieldName) => {
  return respFunction([], errors[0], [`${fieldName}`]);
};

const missingRequiredParams = (fieldName) => {
  return respFunction([], errors[1], [`${fieldName} required!`]);
};

const notFound = (fieldName) => {
  return respFunction([], errors[2], [`${fieldName} not found!`]);
};

const notValid = (fieldName) => {
  return respFunction([], errors[3], [`${fieldName} is not valid!`]);
};

const successResponse = (fieldName) => {
  return respFunction([], success, [`${fieldName} successfully!`]);
};

module.exports = {
  errorResponse,
  missingRequiredParams,
  notFound,
  notValid,
  successResponse,
};
