import { Router } from 'express';
import { Routes } from 'interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import TaskController from '../controllers/task.controller';
import { CreateTaskDto } from '../dtos/tasks.dto';
import validationMiddleware from '../middlewares/validation.middleware';

class TaskRoute implements Routes {
  path = '/tasks';
  router = Router();
  taskController = new TaskController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.taskController.getTasks);
    this.router.get(`${this.path}/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`, authMiddleware, this.taskController.getTaskById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateTaskDto, 'body', true), this.taskController.createTask);
    this.router.put(`${this.path}/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`, authMiddleware, validationMiddleware(CreateTaskDto, 'body'), this.taskController.updateTask);
    this.router.patch(`${this.path}/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`, authMiddleware, this.taskController.finishTask);
    this.router.delete(`${this.path}/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`, authMiddleware, this.taskController.deleteTask);
  }
}

export default TaskRoute;
