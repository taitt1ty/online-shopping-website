import statisticService from "../services/statisticService";
const handleRequest = async (handler, req, res) => {
  try {
    const data = await handler(req.query);
    if (!data) {
      return res
        .status(500)
        .json(errorResponse("Failed to process the request"));
    }
    const statusCode = data.statusCode || 200;
    return res.status(statusCode).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Internal server error"));
  }
};

const getCountCardStatistic = async (req, res) => {
  return handleRequest(statisticService.getCountCardStatistic, req, res);
};

const getCountStatusOrder = async (req, res) => {
  return handleRequest(statisticService.getCountStatusOrder, req, res);
};

const getStatisticByMonth = async (req, res) => {
  return handleRequest(statisticService.getStatisticByMonth, req, res);
};

const getStatisticByDay = async (req, res) => {
  return handleRequest(statisticService.getStatisticByDay, req, res);
};

const getStatisticOverturn = async (req, res) => {
  return handleRequest(statisticService.getStatisticOverturn, req, res);
};

const getStatisticProfit = async (req, res) => {
  return handleRequest(statisticService.getStatisticProfit, req, res);
};

const getStatisticStockProduct = async (req, res) => {
  return handleRequest(statisticService.getStatisticStockProduct, req, res);
};

export default {
  getCountCardStatistic,
  getCountStatusOrder,
  getStatisticByMonth,
  getStatisticByDay,
  getStatisticOverturn,
  getStatisticProfit,
  getStatisticStockProduct,
};
