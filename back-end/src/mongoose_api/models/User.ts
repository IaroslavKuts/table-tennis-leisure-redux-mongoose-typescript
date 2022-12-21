//ORM model for table `users`
import bcrypt from "bcrypt";
import { Schema, SchemaTypes } from "mongoose";
import { IUser } from "../mongo_models_interfaces";

const userSchema: Schema = new Schema<IUser>({
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

userSchema.pre("save", async function (this, next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (
  plainPass: string
): Promise<boolean> {
  return bcrypt.compare(plainPass, this.password);
};
export default userSchema;
