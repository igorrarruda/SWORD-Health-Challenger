import bcrypt, { hash } from 'bcrypt';
import request from 'supertest';
import { CreateUserDto } from '../dtos/users.dto';
import App from '../app';
import { TestHelper } from '../helpers/test.helper';
import { CreateTaskDto } from '../dtos/tasks.dto';
import TaskRoute from '../routes/task.route';
import AuthRoute from '../routes/auth.route';
import { User } from '../entities/User.entity';
import { Task } from '../entities/Task.entity';

describe('Testing Tasks as a Technician', () => {
  let superRequest: request.SuperTest<request.Test>
  let insertedUsers: User[];
  let insertedTasks: Task[];
  beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
    const app = new App();
    superRequest = request(app.app);

    const users = [
      {
        name: "Test Technician",
        email: 'test.technician@email.com',
        password: await hash('q1w2e3r4', 10),
        role: { id: 2 }
      },
      {
        name: "Test Technician2",
        email: 'test.technician2@email.com',
        password: await hash('q1w2e3r4', 10),
        role: { id: 2 }
      },
      {
        name: "Test Manager",
        email: 'test.manager@email.com',
        password: await hash('q1w2e3r4', 10),
        role: { id: 1 }
      }
    ] as User[];

    insertedUsers = await User.save(users);

    const tasksByTest = [
      {
        summary: "task test",
        user: { id: insertedUsers[0].id }
      }, {
        summary: "task test 1",
        user: { id: insertedUsers[0].id }
      }, {
        summary: "task test 2",
        user: { id: insertedUsers[1].id }
      },
    ] as Task[];
    insertedTasks = await Task.save(tasksByTest);
  });

  afterAll(() => {
    TestHelper.instance.teardownTestDB();
  });
  describe('As a Technician', () => {
    let cookie: string;
    beforeAll(async () => {
      const authRoute = new AuthRoute();
      const userDto: CreateUserDto = {
        name: "Test Technician",
        email: 'test.technician@email.com',
        password: 'q1w2e3r4',
        role: 2
      }
      const cookieObj = await authRoute.authController.authService.login(userDto);
      cookie = cookieObj.cookie;
    });

    describe('[GET] /tasks', () => {
      it('response getAll tasks that user own', async () => {
        const tasksRoute = new TaskRoute();

        return superRequest
          .get(`${tasksRoute.path}`)
          .set("Cookie", [cookie])
          .expect(200)
          .then((res) => {
            res.body.map((task) => expect(task.user.id).toEqual(insertedUsers[0].id))
          });
      });
    });

    describe('[GET] /tasks/:id', () => {
      it('response get task by id', async () => {
        const tasksRoute = new TaskRoute();

        return superRequest
          .get(`${tasksRoute.path}/${insertedTasks[0].id}`)
          .set("Cookie", [cookie])
          .expect(200)
          .then((res) => {
            expect(res.body.summary).toEqual(insertedTasks[0].summary)
          });
      });
      it('response should return error if id doesn\'t exists', async () => {
        const tasksRoute = new TaskRoute();

        return superRequest
          .get(`${tasksRoute.path}/6311f66a-19c4-4da4-8232-99b6b92b331d`)
          .set("Cookie", [cookie])
          .expect(404)
          .expect({ message: "Task doesn't exist" });
      });
    });

    describe('[POST] /tasks/', () => {
      it('response Create task', async () => {
        const taskData: CreateTaskDto = {
          summary: "task test new"
        };

        const tasksRoute = new TaskRoute();

        return superRequest
          .post(`${tasksRoute.path}`)
          .send(taskData)
          .set("Cookie", [cookie])
          .expect(201);
      });
    });

    describe('[PUT] /tasks/', () => {
      it('response Update task', async () => {
        const tasksRoute = new TaskRoute();

        const taskDataUpdated: CreateTaskDto = {
          summary: "task test updated"
        };

        return superRequest
          .put(`${tasksRoute.path}/${insertedTasks[0].id}`)
          .send(taskDataUpdated)
          .set("Cookie", [cookie])
          .expect(200)
          .then((res) => {
            expect(res.body.summary).toEqual(taskDataUpdated.summary)
          });
      });

      it('response should return error if id doesn\'t exists', async () => {
        const tasksRoute = new TaskRoute();

        const taskDataUpdated: CreateTaskDto = {
          summary: "test3"
        };

        return superRequest
          .put(`${tasksRoute.path}/6311f66a-19c4-4da4-8232-99b6b92b331d`)
          .send(taskDataUpdated)
          .set("Cookie", [cookie])
          .expect(404)
          .expect({ message: "Task doesn't exist" });
      });

      it('response should return error if the task is not user own', async () => {
        const tasksRoute = new TaskRoute();

        const authRoute = new AuthRoute();
        const userDto: CreateUserDto = {
          name: "Test Technician",
          email: 'test.technician2@email.com',
          password: 'q1w2e3r4',
          role: 2
        }
        const { cookie: cookie2 } = await authRoute.authController.authService.login(userDto);

        const taskDataUpdated: CreateTaskDto = {
          summary: "test task updated"
        };

        return superRequest
          .put(`${tasksRoute.path}/${insertedTasks[0].id}`)
          .send(taskDataUpdated)
          .set("Cookie", [cookie2])
          .expect(403)
          .expect({ message: "You only can change your tasks" });
      });
    });

    describe('[PATCH] /tasks/', () => {
      it('response Perform task', async () => {
        jest
          .useFakeTimers()
          .setSystemTime(new Date('2023-01-21'));

        const tasksRoute = new TaskRoute();

        return superRequest
          .patch(`${tasksRoute.path}/${insertedTasks[0].id}`)
          .set("Cookie", [cookie])
          .expect(200)
          .then((res) => {
            expect(res.body.finishedDate).toEqual("2023-01-21T00:00:00.000Z")
          });
      });

      it('response should return error if the task is not user own', async () => {
        const tasksRoute = new TaskRoute();

        const authRoute = new AuthRoute();
        const userDto: CreateUserDto = {
          name: "Test Technician",
          email: 'test.technician2@email.com',
          password: 'q1w2e3r4',
          role: 2
        }
        const { cookie: cookie2 } = await authRoute.authController.authService.login(userDto);

        return superRequest
          .patch(`${tasksRoute.path}/${insertedTasks[0].id}`)
          .set("Cookie", [cookie2])
          .expect(403)
          .expect({ message: "You only can perform tasks that you own" });
      });

      it('response should return error if the task doesn\'t exist', async () => {
        const tasksRoute = new TaskRoute();

        return superRequest
          .patch(`${tasksRoute.path}/6311f66a-19c4-4da4-8232-99b6b92b331d`)
          .set("Cookie", [cookie])
          .expect(404)
          .expect({ message: "Task doesn't exist" });
      });
    });

    describe('[DELETE] /tasks/', () => {
      it('response should return error if technician user try delete a task', async () => {
        jest.useFakeTimers({ legacyFakeTimers: true })
        const tasksRoute = new TaskRoute();

        return superRequest
          .delete(`${tasksRoute.path}/${insertedTasks[0].id}`)
          .set("Cookie", [cookie])
          .expect(403)
          .expect({ message: "Only Manager can perform this action" });
      });
    });
  });

  describe('As a Manager', () => {
    let cookie: string;
    beforeAll(async () => {
      const authRoute = new AuthRoute();
      const userDto: CreateUserDto = {
        name: "Test Manager",
        email: 'test.manager@email.com',
        password: 'q1w2e3r4',
        role: 1
      };
      const cookieObj = await authRoute.authController.authService.login(userDto);
      cookie = cookieObj.cookie;
    });

    describe('[GET] /tasks', () => {
      it('response getAll tasks', async () => {
        const tasksRoute = new TaskRoute();

        return superRequest
          .get(`${tasksRoute.path}`)
          .set("Cookie", [cookie])
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveLength(4)
          });
      });
    });

    describe('[GET] /tasks/:id', () => {
      it('response get any task by id', async () => {
        const tasksRoute = new TaskRoute();

        return superRequest
          .get(`${tasksRoute.path}/${insertedTasks[1].id}`)
          .set("Cookie", [cookie])
          .expect(200)
          .then((res) => {
            expect(res.body.summary).toEqual(insertedTasks[1].summary)
          });
      });
    });

    describe('[POST] /tasks', () => {
      it('response get task by id', async () => {
        const taskData: CreateTaskDto = {
          summary: "test"
        };

        const tasksRoute = new TaskRoute();

        return superRequest
          .post(`${tasksRoute.path}`)
          .send(taskData)
          .set("Cookie", [cookie])
          .expect(403)
          .expect({ message: "Only Technician users can perform this action" });
      });
    });

    describe('[DELETE] /tasks/', () => {
      it('response delete a tasks', async () => {
        jest.useFakeTimers({ legacyFakeTimers: true })
        const tasksRoute = new TaskRoute();

        return superRequest
          .delete(`${tasksRoute.path}/${insertedTasks[0].id}`)
          .set("Cookie", [cookie])
          .expect(200);
      });

      it('response should return error if task doens\'t exists', async () => {
        jest.useFakeTimers({ legacyFakeTimers: true })
        const tasksRoute = new TaskRoute();

        return superRequest
          .delete(`${tasksRoute.path}/${insertedTasks[0].id}`)
          .set("Cookie", [cookie])
          .expect(404)
          .expect({ message: "Task doesn't exist" });
      });
    });
  });
});
