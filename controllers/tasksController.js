const data = {};
data.Tasks = require("../model/Tasks.json");
const createTasks = require("../model/tasks");

const getAllTasks = (req, res) => {
  res.json(data.Tasks);
};

const addTask = (req, res) => {
  res.json({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
};

const updateTask = (req, res) => {
  res.json({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
};

const deleteTask = (req, res) => {
  res.json({ id: req.body.id });
};

const getATask = (req, res) => {
  res.json({ id: req.params.id });
};

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  getATask,
};
