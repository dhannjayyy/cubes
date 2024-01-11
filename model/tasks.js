const { connection } = require("../Config/DBConnect");

const createTasksTable = () => {
  try {
    const createUserQuery =
      "CREATE TABLE `tasks` (`task_id` INT(11) NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL , `description` VARCHAR(500) NOT NULL ,`user_id` INT(11) NOT NULL, PRIMARY KEY (`task_id`))";
    connection.query(createUserQuery, (error, results) => {
      if (error) {
        throw new Error(error.message);
      }
      connection.query(
        "ALTER TABLE `tasks` ADD CONSTRAINT `user_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE"
      );
      console.log(results);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const createTasks =async () => {
  try {
    const checkTableExistence = `SHOW TABLES LIKE 'tasks'`;
    connection.query(checkTableExistence, (error, results) => {
      if (error) {
        throw new Error(error.message);
      }
      if (results.length === 0) {
        createTasksTable();
      }
    });
    
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = createTasks;
