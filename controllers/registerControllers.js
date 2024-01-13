const bcrypt = require("bcrypt");
const { connection } = require("../Config/DBConnect");
const { queryAsync } = require("../helpers/queryAsync");

const handleNewUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email and password are required." });
  }

  const checkExistingUserQuery = `SELECT user_id, email FROM users WHERE email = '${email}'`;

  try {
    const results = await queryAsync(checkExistingUserQuery);

    if (results.length > 0) {
      return res
        .status(409)
        .json({ message: `User with email ${email} already exists.` });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ message: "user could not be registered." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUserQuery = `INSERT INTO users (email, password) VALUES ('${email}', '${hashedPassword}')`;

    await queryAsync(createUserQuery);

    return res.status(201).json({ message: `New user ${email} created!` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
