// CRUD functions for table `user`
import mongoose_api from "../mongoose_api";
import { Request, Response } from "express";
import { IUser } from "../mongoose_api/mongo_models_interfaces";
const User = mongoose_api.User;

const readUser = async (request: Request, response: Response) => {
  const _id = response.locals._id;
  let receivedUser: IUser | null = await User.findOne<IUser>({ _id })
    .select({
      authorities: 1,
      abonenement: 1,
      email: 1,
      person: 1,
      orders: 1,
      theme: 1,
    })
    .populate("abonement person orders")
    .exec();

  if (!receivedUser) {
    return response.status(404).send({ msg: "User was not not found" });
  }
  response.json(receivedUser);
};

const updateUserData = async (
  request: Request<{}, {}, Partial<IUser>>,
  response: Response
) => {
  try {
    const { _id, ...rest } = request.body;
    // const emailDoesExist: Awaited<ReturnType<typeof emailExists>> =
    //   await emailExists(rest.email);

    // if (emailDoesExist)
    //   return response
    //     .status(409)
    //     .json({ message: "This email is taken", field: "email" });

    await User.updateOne<IUser>({ _id }, { ...rest });
    response.json({ message: "User was updated sucessfully" });
  } catch (error) {
    response.json({ message: error });
  }
};

const emailExists = async (email: string): Promise<boolean> => {
  let result = await User.findOne<IUser>({ email });
  return !!result;
};

const userController = {
  readUser,
  updateUserData,
  emailExists,
};
export default userController;
