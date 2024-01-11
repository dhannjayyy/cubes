const { logEvents } = require("./logEvents");

const errorHandler = function (error, req, res, next) {
  logEvents(`${error.name} : ${error.message}`,'errorLog.txt')
  console.log(error);
  res.status(500).send(error.message);
};

module.exports = errorHandler