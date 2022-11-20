const isAdmin = (request, response, next) => {
  const { authorities } = request;
  console.log(`Authorities in isAdmin Function${authorities}`);
  if (authorities !== "admin") {
    const error = new Error(
      "Permission declined. This user does not admin rights"
    );
    error.status = 403;
    next(error);
    return;
  }
  next();
};

const roleVerifiers = { isAdmin };
module.exports = roleVerifiers;
