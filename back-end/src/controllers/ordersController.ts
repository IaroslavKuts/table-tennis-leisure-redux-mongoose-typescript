// CRUD functions for table `orders`
import mongoose_api from "../mongoose_api";
import timePeriodsController from "./timePeriodsController";
import { IOrder } from "../mongoose_api/mongo_models_interfaces";
import { Request, Response } from "express";
import { RequestBodyOrQuery } from "./controllers_interfaces";
import { Types } from "mongoose";
const User = mongoose_api.User;
const Order = mongoose_api.Order;
const readAllOrders = async (request: Request, response: Response) => {
  // let receivedOrders = await orders.findAll({
  //   attributes: ["date_of_game", "start_time", "end_time"],
  // });
  // if (!receivedOrders)
  //   return response.status(404).send({ msg: "Orders were not found" });
  // response.json(receivedOrders);
};

const updateOrder = async (request: Request, response: Response) => {
  //   const user_id = request.user_id;
  //   console.log(request.body);
};

const createOrders = async (
  request: Request<{}, {}, RequestBodyOrQuery>,
  response: Response
) => {
  const _id: Types.ObjectId | string = response.locals._id;
  const { chosenTimePeriods, dateOfGame } = request.body;

  if (chosenTimePeriods !== undefined && dateOfGame !== undefined) {
    let bulkData = await timePeriodsController.readTimePeriodsByIDs(
      chosenTimePeriods
    );

    const result: IOrder[] = bulkData.map(
      ({ start_time, end_time, price }) => ({
        date_of_game: dateOfGame,
        start_time,
        end_time,
        // payment: name_abonement === "basic" ? price : 0,
        payment: price,
        // payment_status: true,
      })
    );

    console.log(_id);
    const createdOrders = await Order.insertMany<IOrder>(result);
    const IDsOfOrders: Types.ObjectId[] = createdOrders.map(({ _id }) => _id);
    console.log(IDsOfOrders);
    await User.updateOne<IOrder>(
      { _id },
      { $push: { orders: { $each: IDsOfOrders } } }
    );
    response.json({ message: "Orders were created sucessfully" });
  }
};

const deleteOrder = async (request: Request, response: Response) => {
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
export default ordersController;
