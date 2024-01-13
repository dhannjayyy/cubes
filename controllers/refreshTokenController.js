const jwt = require("jsonwebtoken");
require("dotenv").config();
const { queryAsync } = require("../helpers/queryAsync");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const fetchRefreshTokenQuery = `SELECT * FROM users WHERE refreshToken = '${refreshToken}'`;
  let foundUser;
  try {
    const results = await queryAsync(fetchRefreshTokenQuery);
    if (results.length === 0) {
      return res.status(403).json({ message: "Forbidden" });
    } else {
      foundUser = results[0];
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error || foundUser.email !== decoded.email)
          return res.sendStatus(403);
        const accessToken = jwt.sign(
          { email: decoded.email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "6h",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "some internal error" });
  }
};

module.exports = { handleRefreshToken };
