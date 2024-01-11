const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cubewealth",
});

const establishDBConnection = async () => {
  connection.connect((error) => {
    if (error) throw new Error(error.message);
    console.log("Connected to db : ", connection.threadId);
  });
};

module.exports = { connection, establishDBConnection };
