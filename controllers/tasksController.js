const { queryAsync } = require("../helpers/queryAsync");

const getAllTasks = async (req, res) => {
  const email = req.email;
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  const tasksQuery = `SELECT tasks.task_id, tasks.title, tasks.description
    FROM tasks
    JOIN users ON tasks.user_id = users.user_id
    WHERE users.email = '${email}'`;

  try {
    const results = await queryAsync(tasksQuery);
    return res.status(200).json({ message: "tasks retrieved", tasks: results });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "tasks could not be retrieved" });
  }
};

const addTask = async (req, res) => {
  const { title: taskTitle, description: taskDescription } = req.body;
  if (!taskTitle || !taskDescription) {
    return res
      .status(400)
      .json({ message: "title and description are required" });
  }

  const addTaskQuery = `INSERT INTO tasks (user_id, title, description)
  VALUES (
    (SELECT user_id FROM users WHERE email = '${req.email}'),
    '${taskTitle}',
    '${taskDescription}'
    )`;

  try {
    await queryAsync(addTaskQuery);
    return res.status(200).json({ message: "new task added" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Task could not be added" });
  }
};

const updateTask = async (req, res) => {
  const { title: newTitle, description: newDescription, taskId } = req.body;
  if (!newTitle || !newDescription || !taskId) {
    return res
      .status(400)
      .json({ message: "title, description, and taskId are required" });
  }

  const updateQuery = `UPDATE tasks SET title = '${newTitle}', description = '${newDescription}' WHERE task_id = '${taskId}'`;

  const checkTaskExistence = `SELECT * FROM tasks WHERE task_id = '${taskId}'`;

  try {
    const results = await queryAsync(checkTaskExistence);
    if (results.length != 0) {
      await queryAsync(updateQuery);
      return res.status(200).json({ message: "task edited" });
    } else {
      return res.status(404).json({ message: "Task does not exists" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Task could not be edited" });
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ message: "taskId is required" });
  }

  const deleteQuery = `DELETE FROM tasks WHERE task_id = ${taskId}`;

  try {
    await queryAsync(deleteQuery);
    return res.status(200).json({ message: "task deleted" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Task could not be deleted" });
  }
};

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
};
