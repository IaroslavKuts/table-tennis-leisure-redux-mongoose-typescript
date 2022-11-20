//ORM model for table `persons`
const { Schema, SchemaTypes } = require("mongoose");

const Person = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  surname: { type: String, required: true },
  passport: { type: String, required: true, unique: true },
  date_of_birth: { type: String, required: true },
  gender: { type: String, required: true },
});

module.exports = Person;
