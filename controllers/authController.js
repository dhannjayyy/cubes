const jwt = require("jsonwebtoken");
require("dotenv").config();
const { queryAsync } = require("../helpers/queryAsync");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email and password are required." });
  }

  const checkExisitingUserQuery = `SELECT user_id, email, password FROM users WHERE email = '${email}'
  `;
  let match;
  try {
    const result = await queryAsync(checkExisitingUserQuery);
    if (result.length === 0) {
      return res.status(401).json({ message: "User not found" });
    } else {
      match = await bcrypt.compare(password, result[0].password);
    }
    if (match) {
      const accessToken = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "6h" }
      );
      const refreshToken = jwt.sign(
        { email: email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const storeRefreshTokenQuery = `UPDATE users SET refreshToken = '${refreshToken}'
      WHERE email = '${email}'`;
      await queryAsync(storeRefreshTokenQuery);
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ message: accessToken });
    } else {
      return res
        .status(409)
        .json({ message: "Wrong Password, please try again." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "some internal error" });
  }
};

module.exports = { handleLogin };
