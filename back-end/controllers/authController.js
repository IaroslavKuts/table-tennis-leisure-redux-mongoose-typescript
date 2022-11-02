const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const DBManager = require("../sequelize");
const auxillary_functions = require("../auxillary_functions");
const services = require("../services");
const { users } = DBManager.models;

//Back-end function tha is responsible for loggin in a user
const handleLogIn = async (request, response) => {
  const { email, password } = request.body;
  if (!email)
    return response.status(400).json({
      error: { message: "Login endpoint. email is undefined" },
    });
  if (!password)
    return response.status(400).json({
      error: { message: "Login endpoint. password is undefined" },
    });

  let receivedUser = await users.findOne({
    where: { email },
    attributes: ["user_id", "authorities", "password", "theme"],
  });

  if (!receivedUser) {
    return response
      .status(400)
      .json({ error: { message: "User does not exist" } });
  } else {
    receivedUser = receivedUser.toJSON();
  }

  // let passwordsAreSame = await bcrypt.compare(password, receivedUser.password);
  // if (!passwordsAreSame)
  //   return response
  //     .status(401)
  //     .json({ error: { message: "Password is incorrect" } });

  const { authorities, user_id } = receivedUser;
  const csrfToken = request.get("x-xsrf-token");
  const accessToken = jwt.sign(
    { user_id, authorities, email },
    process.env.JWT_TOKEN,
    {
      expiresIn: "10s",
    }
  );

  const refreshToken = jwt.sign(
    { authorities, user_id, email },
    process.env.JWT_TOKEN,
    {
      expiresIn: "1d",
    }
  );

  users.update({ refreshToken }, { where: { user_id } });
  response.cookie("jwtRefreshToken", refreshToken, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    //secure: true,
    //sameSite: "None";
  });

  response.json({ accessToken, authorities });
};

const handleRefreshToken = async (request, response) => {
  const jwtRefreshToken = request.cookies["jwtRefreshToken"];
  // if (!jwtRefreshToken)
  //   return response.status(401).json({
  //     error: { message: "Refresh end-point. jwtRefreshToken is undefined" },
  //   });

  let receivedUser = await users.findOne({
    where: { refreshToken: jwtRefreshToken },
    attributes: ["user_id", "authorities", "password", "theme"],
  });

  if (!receivedUser) {
    return response.status(400).json({
      error: { message: "User does not exist" },
    });
  } else {
    receivedUser = receivedUser.toJSON();
  }

  const { user_id, email, authorities } = receivedUser;
  jwt.verify(jwtRefreshToken, process.env.JWT_TOKEN, async (err, decoded) => {
    if (err)
      return response.status(403).json({
        error: err,
      });
    if (user_id !== decoded.user_id)
      return response.status(403).json({
        error: { message: "Decoded user_id is not equal to user_id from DB" },
      });

    const accessToken = jwt.sign(
      { user_id, authorities, email },
      process.env.JWT_TOKEN,
      {
        expiresIn: "10s",
      }
    );

    const refreshToken = jwt.sign(
      { authorities, user_id, email },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    users.update({ refreshToken }, { where: { user_id } });
    response.cookie("jwtRefreshToken", refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      //secure: true,
      //sameSite: "None";
    });

    response.json({ accessToken, authorities });
  });
};

//Back-end function tha is responsible for loggin out a user
const handleLogout = async (request, response) => {
  const jwtRefreshToken = request.cookies["jwtRefreshToken"];
  if (!jwtRefreshToken)
    return response.status(401).json({
      error: { message: "Logout end-point. jwtRefreshToken is undefined" },
    });
  users.update(
    { refreshToken: null },
    { where: { refreshToken: jwtRefreshToken } }
  ); //VALID UNTIL
  response.clearCookie("jwtRefreshToken", { httpOnly: true }); // sameSite: "None", secure: true
  response.sendStatus(204);

  // Delete refreshToken in db
};

const restorePassword = async (request, response) => {
  const { email } = request.body;
  const password = auxillary_functions.generateNumber();
  users.update({ password }, { where: { email }, individualHooks: true });
  services.sendMail(
    email,
    "Password restoration",
    `Your new password is: ${password}`
  );
};

const authController = {
  handleLogIn,
  handleRefreshToken,
  handleLogout,
  restorePassword,
};
module.exports = authController;
