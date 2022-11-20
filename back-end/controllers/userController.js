// CRUD functions for table `user`
const { User, Person } = require("../mongoose_api");

const readUser = async (request, response) => {
  const _id = request._id;
  let receivedUser = await User.findOne({ _id })
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

const updateUserData = async (request, response) => {
  try {
    const { _id, ...rest } = request.body;
    const emailExists = await emailExists(rest.email);

    if (emailExists)
      return response
        .status(409)
        .json({ message: "This email is taken", field: "email" });

    await User.updateOne({ _id }, { ...rest });
    response.json({ message: "User was updated sucessfully" });
  } catch (error) {
    response.json({ message: error });
  }
};

const emailExists = async (email) => {
  let result = await User.findOne({ email });
  return !!result;
};

const userController = {
  readUser,
  updateUserData,
  emailExists,
};
module.exports = userController;
