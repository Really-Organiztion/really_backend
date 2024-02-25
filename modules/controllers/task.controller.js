const taskService = require("../services/task.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    taskService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
 
        taskService.create(req, res);
    
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    taskService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateTask = (req, res) => {
  try {
    const id = req.params.id;
    taskService.updateTask(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteTask = (req, res) => {
  try {
    const id = req.params.id;
    taskService.deleteTask(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
getDeliveredTaskByTaskId = (req, res) => {
  try {
    const id = req.params.id;
    taskService.getDeliveredTaskByTaskId(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
checkUserTask = (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    taskService.checkUserTask(req, res, taskId, userId);
  } catch (error) {
    logger.error(error);
  }
};
replaceTaskAttachment = (req, res) => {
  try {
  
          const id = req.params.id;
          taskService.replaceTaskAttachment(req, res, id);
      
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  create,
  findById,
  updateTask,
  deleteTask,
  getDeliveredTaskByTaskId,
  replaceTaskAttachment,
  checkUserTask,
};
