// CRUD functions for table `abonements`
import { Request, Response } from "express";

import mongooseAPI from "../mongoose_api";
import { IAbonement } from "../mongoose_api/mongo_models_interfaces";
const Abonement = mongooseAPI.Abonement;

const readAllAbonements = async (request: Request, response: Response) => {
  let receivedAllAbonements = await Abonement.find<IAbonement>();
  if (!receivedAllAbonements)
    return response.status(404).send({ msg: "Abonements were not found" });
  response.json(receivedAllAbonements);
};

const createAbonement = async (
  request: Request<{}, {}, IAbonement>,
  response: Response
) => {
  const { name_of_abonement, description, price } = request.body;
  Abonement.create<IAbonement>({ name_of_abonement, description, price });
  response.json({ message: "Success" });
};

const abonementController = {
  readAllAbonements,
  createAbonement,
};
export default abonementController;
