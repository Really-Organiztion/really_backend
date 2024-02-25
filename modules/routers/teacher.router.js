const express = require("express");
const teacherRouter = express.Router();
const teacherController = require("../controllers/teacher.controller");

teacherRouter.get("/", teacherController.getAllData);

teacherRouter.route("/").post((req, res) => {
 
      teacherController.createTeacher(req, res);
   
});
teacherRouter.get("/approved", teacherController.findAllApprovedTeachers);

teacherRouter.route("/personalImage/:id").put((req, res) => {
 
        const id = req.params.id;
        teacherController.updateTeacherPersonalImage(req, res, id);
    
});
teacherRouter.route("/changePassword/:id").put((req, res) => {
 
        const id = req.params.id;
        teacherController.changePassword(req, res, id);
     
});
teacherRouter.route("/status/:id").put((req, res) => {
 
        const id = req.params.id;
        teacherController.updateTeacherStatus(req, res, id);
     
});
teacherRouter.get("/:id", teacherController.findById);

teacherRouter.route("/:id").put((req, res) => {
 
      const id = req.params.id;
      teacherController.updateTeacher(req, res, id);
  
});
teacherRouter.delete("/:id", teacherController.deleteTeacher);

module.exports = teacherRouter;
