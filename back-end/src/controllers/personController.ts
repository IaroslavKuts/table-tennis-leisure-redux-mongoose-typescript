// CRUD functions for table `person`
import mongoose_api from "../mongoose_api";
import { IPerson } from "../mongoose_api/mongo_models_interfaces";
import { PersonFieldToUpdate } from "./controllers_interfaces";
import { Request, Response } from "express";
const Person = mongoose_api.Person;

const updatePerson = async (
  request: Request<{}, {}, PersonFieldToUpdate>,
  response: Response
) => {
  try {
    const { personID, ...rest } = request.body;
    console.log(rest);
    if (rest?.passport && (await passportExists(rest.passport))) {
      return response
        .status(409)
        .json({ message: "This passport is taken", field: "passport" });
    }
    await Person.updateOne<IPerson>({ _id: personID }, { ...rest });
    response.json({ message: "Personal data was updated sucessfully" });
  } catch (err) {
    response.json({ message: err });
  }
};

const passportExists = async (passport: string) => {
  const result = await Person.findOne({ passport });
  return !!result;
};

const personController = { updatePerson, passportExists };
export default personController;
