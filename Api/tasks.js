const express = require("express");
const router = express.Router();
const taskControllers = require("../controllers/tasksController");

router
  .route("/")
  .get(taskControllers.getAllTasks)
  .post(taskControllers.addTask)
  .put(taskControllers.updateTask)
  .delete(taskControllers.deleteTask);

module.exports = router;
