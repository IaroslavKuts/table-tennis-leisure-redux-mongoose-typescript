const DBManager = require("../sequelize");
const { abonements, users } = DBManager.models;

// CRUD functions for table `abonements`

const readAllAbonements = async (request, response) => {
  let receivedAllAbonements = await abonements.findAll({});
  if (!receivedAllAbonements)
    return response.status(404).send({ msg: "Abonements were not found" });
  response.json(receivedAllAbonements);
};

const createAbonement = async (request, response) => {
  const { name_of_abonement, description, price } = request.body;
  abonements.create({ name_of_abonement, description, price });
  response.json({ message: "Success" });
};

const abonementController = {
  readAllAbonements,
  createAbonement,
};
module.exports = abonementController;
