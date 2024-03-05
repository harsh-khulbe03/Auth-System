// const jwt = require("jsonwebtoken");
// const { User } = require("../models/user");

// module.exports = async (req, res, next) => {
//   const token =
//     req.headers.authorization && req.headers.authorization.split(" ")[1];

//   if (!token) {
//     return res.json({
//       message: "Please provide the token to validate the user",
//     });
//   }

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     const user = await User.findOne({ _id: payload.userId });

//     if (!user) {
//       return res.status(401).json({ error: "User not found" });
//     }

//     req.user = user;
//     console.log("user", req.user);
//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(401).json({ error: "Invalid token" });
//   }
// };

const jwt = require("jsonwebtoken");

class Authentication {
  static async authenticate(req, res, next) {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.json({
        message: "Please provide the token to validate the user",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userDetails) => {
      if (err) {
        return res.json({
          message: "User is not authorized",
          error: err,
        });
      }

      req.user = userDetails;
      next();
    });
  }
}

module.exports = Authentication;
