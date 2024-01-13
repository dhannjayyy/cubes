const { connection } = require("../Config/DBConnect");

const createUserTable = () => {
  try {
    const createUserQuery =
      "CREATE TABLE `users` (`user_id` INT(11) NOT NULL AUTO_INCREMENT , `email` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL , `refreshToken` VARCHAR(255) NULL, PRIMARY KEY (`email`), UNIQUE `user_index` (`user_id`))";
    connection.query(createUserQuery, (error, results) => {
      if (error) {
        throw new Error(error.message);
      }

      console.log(results);
    });
  } catch (error) {
    console.log(error.stack);
  }
};

const createUsers = () => {
  try {
    const checkTableExistence = `SHOW TABLES LIKE 'users'`;
    connection.query(checkTableExistence, (error, results) => {
      if (error) {
        throw new Error(error.message);
      }
      if (results.length === 0) {
        createUserTable();
      }
    });
  } catch (error) {
    console.log(error.stack);
  }
};

module.exports = createUsers;
