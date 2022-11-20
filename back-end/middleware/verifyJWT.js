const jwt = require("jsonwebtoken");
//Function that verifies jwtToken
const verifyJWT = (request, response, next) => {
  let jwtRefreshToken = request.cookies["jwtRefreshToken"];
  if (!jwtRefreshToken) {
    const error = new Error("Middleware. jwtToken is undefined");
    error.status = 401;
    next(error);
    return;
  }

  jwt.verify(jwtRefreshToken, process.env.JWT_TOKEN, (err, decoded) => {
    if (err) {
      const error = new Error(err);
      error.status = 500;
      next(error);
      return;
    }
    request._id = decoded._id;
    request.authorities = decoded.authorities;

    console.log(
      "Verified " +
        `Request.user_id ${request._id} Request.authorities ${request.authorities}`
    );
    next();
  });
};

module.exports = verifyJWT;
