//ORM model for table `users`
const bcrypt = require("bcrypt");
const { Schema, SchemaTypes } = require("mongoose");
const person = require("./Person");

const User = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  authorities: { type: String, required: true, default: "user" },
  abonement: {
    type: SchemaTypes.ObjectId,
    ref: "abonement",
    default: "6369795e99382929d3313426",
  },
  person: { type: SchemaTypes.ObjectId, ref: "person" },
  orders: [{ type: SchemaTypes.ObjectId, ref: "order" }],
  theme: { type: String, default: "light" },
  refreshToken: String,
});

User.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

User.methods.comparePassword = async function (plainPass) {
  return bcrypt.compare(plainPass, this.password);
};
module.exports = User;
