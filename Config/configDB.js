const createUsers = require("../model/users");
const createTasks = require("../model/tasks");
const EventEmitter = require("events");

const emitter = new EventEmitter();
const configDB = () => {
  try {
    createUsers();
    createTasks();
    setInterval(() => {
      emitter.emit("connectionSuccessful");
    }, 0);
  } catch (error) {
    console.log(error.stack);
  }
};

module.exports = { configDB, emitter };
