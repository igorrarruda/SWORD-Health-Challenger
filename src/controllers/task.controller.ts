import { CreateTaskDto } from 'dtos/tasks.dto';
import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from 'interfaces/auth.interface';
import TaskService from "../services/task.service";

class TaskController {
  taskService = new TaskService();

  getTasks = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasksData = await this.taskService.findAll(req.user);

      res.status(200).json(tasksData);
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = req.params.id;
      const taskData = await this.taskService.findById(taskId, req.user);

      res.status(200).json(taskData);
    } catch (error) {
      next(error);
    }
  };

  createTask = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskData: CreateTaskDto = req.body;
      const createTaskData = await this.taskService.create(taskData, req.user);

      res.status(201).json(createTaskData);
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = req.params.id;
      const taskData: CreateTaskDto = req.body;
      const updateTaskData = await this.taskService.update(taskId, taskData, req.user);

      res.status(200).json(updateTaskData);
    } catch (error) {
      next(error);
    }
  };

  finishTask = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = req.params.id;
      const updateTaskData = await this.taskService.finish(taskId, req.user);

      res.status(200).json(updateTaskData);
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = req.params.id;
      const deleteTaskData = await this.taskService.delete(taskId, req.user);

      res.status(200).json(deleteTaskData);
    } catch (error) {
      next(error);
    }
  };
}

export default TaskController;
