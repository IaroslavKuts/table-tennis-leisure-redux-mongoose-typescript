import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import auxillary_functions from "../auxillary_functions";
import { IUser, IPerson } from "../mongoose_api/mongo_models_interfaces";
import mongoose_api from "../mongoose_api";
import services from "../services";
import userController from "./userController";
import personController from "./personController";
import { VerifiedUser } from "./controllers_interfaces";
const Person = mongoose_api.Person;
const User = mongoose_api.User;

//Back-end function tha is responsible for loggin in a user
const handleLogIn = async (
  request: Request<{}, {}, Pick<IUser, "email" | "password">>,
  response: Response
) => {
  const { email, password } = request.body;
  if (!email)
    return response.status(400).json({
      error: { message: "Login endpoint. email is undefined" },
    });
  if (!password)
    return response.status(400).json({
      error: { message: "Login endpoint. password is undefined" },
    });

  try {
    let receivedUser: IUser | null = await User.findOne<IUser>({ email });

    if (!receivedUser) {
      return response
        .status(400)
        .json({ message: "There is no user with such email" });
    }
    console.log(receivedUser);

    let passwordsAreSame = await receivedUser.comparePassword(password);
    if (!passwordsAreSame)
      return response.status(401).json({ message: "Password is incorrect" });

    const { authorities, _id } = receivedUser;
    const csrfToken = request.get("x-xsrf-token");
    const accessToken = jwt.sign(
      { _id, authorities, email },
      process.env.JWT_TOKEN as string,
      {
        expiresIn: "10s",
      }
    );
    const refreshToken = jwt.sign(
      { authorities, _id, email },
      process.env.JWT_TOKEN as string,
      {
        expiresIn: "1d",
      }
    );
    User.updateOne<IUser>({ _id }, { refreshToken }).exec();
    response.cookie("jwtRefreshToken", refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      //secure: true,
      //sameSite: "None";
    });
    response.json({ accessToken, authorities });
  } catch (err) {
    response.json(err);
  }
};

const handleRefreshToken = async (request: Request, response: Response) => {
  const jwtRefreshToken = request.cookies["jwtRefreshToken"];
  let receivedUser = await User.findOne<IUser>({
    refreshToken: jwtRefreshToken,
  }).select({
    _id: 1,
    authorities: 1,
    theme: 1,
  });

  if (!receivedUser) {
    return response.status(400).json({
      error: { message: "User does not exist" },
    });
  }
  try {
    const { _id, email, authorities } = receivedUser;
    const verifiedUser: VerifiedUser = jwt.verify(
      jwtRefreshToken,
      process.env.JWT_TOKEN as string
    ) as VerifiedUser;

    if (_id !== verifiedUser._id)
      return response.status(403).json({
        error: {
          message: "Decoded user_id is not equal to user_id from DB",
        },
      });
    const accessToken: string = jwt.sign(
      { _id, authorities, email },
      process.env.JWT_TOKEN as string,
      {
        expiresIn: "10s",
      }
    );
    const refreshToken: string = jwt.sign(
      { authorities, _id, email },
      process.env.JWT_TOKEN as string,
      {
        expiresIn: "1d",
      }
    );
    User.updateOne<IUser>({ _id }, { refreshToken });
    response.cookie("jwtRefreshToken", refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      //secure: true,
      //sameSite: "None";
    });
    response.json({ accessToken, authorities });
  } catch (err) {
    if (err instanceof Error) {
      response.status(403).json({
        error: err,
      });
    }
  }
};

//Back-end function tha is responsible for loggin out a user
const handleLogout = async (request: Request, response: Response) => {
  const jwtRefreshToken = request.cookies["jwtRefreshToken"];
  if (!jwtRefreshToken)
    return response.status(401).json({
      error: { message: "Logout end-point. jwtRefreshToken is undefined" },
    });
  User.updateOne<IUser>(
    { refreshToken: jwtRefreshToken },
    { refreshToken: null }
  );

  //VALID UNTIL
  response.clearCookie("jwtRefreshToken", { httpOnly: true }); // sameSite: "None", secure: true
  response.sendStatus(204);
  // Delete refreshToken in db
};

const restorePassword = async (
  request: Request<{}, {}, IUser>,
  response: Response
) => {
  const { email } = request.body;
  const password: string = auxillary_functions.generateNumber();
  User.updateOne<IUser>(
    { password },
    { where: { email }, individualHooks: true }
  );
  services.sendMail(
    email,
    "Password restoration",
    `Your new password is: ${password}`
  );
};

const registrateUser = async (request: Request, response: Response) => {
  const {
    email,
    password,
    first_name,
    surname,
    passport,
    date_of_birth,
    gender,
  } = request.body;
  const emailExists = await userController.emailExists(email);
  const passportExists = await personController.passportExists(passport);
  if (emailExists)
    return response
      .status(409)
      .json({ message: "This email is taken", field: "email" });
  if (passportExists)
    return response
      .status(409)
      .json({ message: "This passport is taken", field: "passport" });
  try {
    const createdUser = new User({
      email,
      password,
    });
    console.log(createdUser);
    const createdPerson = new Person({
      first_name,
      surname,
      passport,
      date_of_birth,
      gender,
    });
    createdUser.person = createdPerson._id;
    await createdUser.save();
    await createdPerson.save();

    response.json({ message: "User was created successfully" });
  } catch (err) {
    // console.log(err.keyPattern);
    // const [field] = Object.keys(err.keyPattern);
    // response.status(409).json(field);
  }
};

const authController = {
  handleLogIn,
  handleRefreshToken,
  handleLogout,
  restorePassword,
  registrateUser,
};
export default authController;
