// CRUD functions for table `orders`
const { User, Order } = require("../mongoose_api");
const { readTimePeriodsByIDs } = require("./timePeriodsController");
const readAllOrders = async (request, response) => {
  // let receivedOrders = await orders.findAll({
  //   attributes: ["date_of_game", "start_time", "end_time"],
  // });
  // if (!receivedOrders)
  //   return response.status(404).send({ msg: "Orders were not found" });
  // response.json(receivedOrders);
};

const updateOrder = async (request, response) => {
  //   const user_id = request.user_id;
  //   console.log(request.body);
};

const createOrders = async (request, response) => {
  const _id = request._id;
  const { chosenTimePeriods, dateOfGame, name_abonement } = request.body;

  let bulkData = await readTimePeriodsByIDs(chosenTimePeriods);

  bulkData = bulkData.map(({ start_time, end_time, price }) => ({
    date_of_game: dateOfGame,
    start_time,
    end_time,
    // payment: name_abonement === "basic" ? price : 0,
    payment: price,
    // payment_status: true,
  }));

  console.log(_id);
  const createdOrders = await Order.insertMany(bulkData);
  const IDsOfOrders = createdOrders.map(({ _id }) => _id);
  console.log(IDsOfOrders);
  await User.updateOne({ _id }, { $push: { orders: { $each: IDsOfOrders } } });
  response.json({ message: "Orders were created sucessfully" });
};

const deleteOrder = async (request, response) => {
  try {
    const { order_id } = request.body;
    await Order.deleteOne({ _id: order_id });
    response.json({ message: "Order was deleted successfully" });
  } catch (err) {
    response.json({ message: err });
  }
};

const ordersController = {
  updateOrder,
  createOrders,
  readAllOrders,
  deleteOrder,
};
module.exports = ordersController;
