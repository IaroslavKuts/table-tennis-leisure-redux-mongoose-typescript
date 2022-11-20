// CRUD functions for table `person`
const { Person } = require("../mongoose_api");
const updatePerson = async (request, response) => {
  try {
    const { personID, ...rest } = request.body;
    console.log(rest);
    if (rest?.passport && (await passportExists(rest.passport))) {
      return response
        .status(409)
        .json({ message: "This passport is taken", field: "passport" });
    }
    await Person.updateOne({ _id: personID }, { ...rest });
    response.json({ message: "Personal data was updated sucessfully" });
  } catch (err) {
    response.json({ message: err });
  }
};

const passportExists = async (passport) => {
  const result = await Person.findOne({ passport });
  return !!result;
};

const personController = { updatePerson, passportExists };
module.exports = personController;
