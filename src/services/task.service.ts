import { User } from '../entities/User.entity';
import { CreateTaskDto } from '../dtos/tasks.dto';
import { Task } from '../entities/Task.entity';
import { HttpException } from '../exceptions/HttpException';
import Rabbitmq from '../integrations/rabbitmq.integration';

class TaskService extends Task {
  async findAll(user: User): Promise<Task[]> {
    let tasks: Task[];

    if (user.role.id === 1) {
      tasks = await Task.find({
        relations: { user: true },
      });
    } else {
      tasks = await this.findByTechnical(user.id)
    }

    return tasks;
  }

  async findByTechnical(userId: string): Promise<Task[]> {
    const tasks = await Task.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    return tasks;
  }

  async findById(taskId: string, user: User): Promise<Task> {
    let task: Task;

    if (user.role.id === 1) {
      task = await Task.findOne({
        where: { id: taskId },
        relations: { user: true },
      });
    } else {
      task = await this.findByIdTechnical(taskId, user.id)
    }

    if (!task) throw new HttpException(404, "Task doesn't exist");
    return task;
  }

  async findByIdTechnical(taskId: string, userId: string): Promise<Task> {
    const task = await Task.findOne({
      where: { id: taskId, user: { id: userId } },
      relations: { user: true },
    });

    return task;
  }

  async create(taskData: CreateTaskDto, user: User): Promise<Task> {
    if (user.role.id === 1) throw new HttpException(403, "Only Technician users can perform this action");

    const task = await Task.create({ ...taskData, user }).save();
    return task;
  }

  async update(taskId: string, taskData: CreateTaskDto, user: User): Promise<Task> {
    const task = await Task.findOne({ where: { id: taskId }, relations: ["user"] });
    if (!task) throw new HttpException(404, "Task doesn't exist");
    if (task.user.id !== user.id) throw new HttpException(403, "You only can change your tasks");

    await Task.update(taskId, taskData);

    const updatedTask = await Task.findOne({ where: { id: taskId } });
    return updatedTask;
  }

  async finish(taskId: string, user: User): Promise<Task> {
    const task = await Task.findOne({ where: { id: taskId }, relations: ["user"] });
    if (!task) throw new HttpException(404, "Task doesn't exist");
    if (task.user.id !== user.id) throw new HttpException(403, "You only can perform tasks that you own");

    await Task.update(taskId, { finishedDate: new Date() });

    const updatedTask = await Task.findOne({ where: { id: taskId }, relations: ["user"] });

    this.sendNotification(updatedTask);
    return updatedTask;
  }

  async delete(taskId: string, user: User): Promise<Task> {
    if (user.role.id !== 1) throw new HttpException(403, "Only Manager can perform this action");

    const findTask = await Task.findOne({ where: { id: taskId } });
    if (!findTask) throw new HttpException(404, "Task doesn't exist");

    await Task.softRemove(findTask);
    return findTask;
  }

  async sendNotification(task: Task) {
    const server = new Rabbitmq();
    await server.start();
    await server.publishInQueue(
      'PERFORMED_TASK',
      JSON.stringify({
        subject: `The tech ${task.user.name} performed the task ${task.id} on date ${task.finishedDate.toISOString()}.`,
      })
    );
  }
}

export default TaskService;
