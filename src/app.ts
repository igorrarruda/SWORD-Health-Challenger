import "reflect-metadata"
import cookieParser from 'cookie-parser';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Routes } from "./interfaces/routes.interface";
import { DataSource } from "typeorm";
import errorMiddleware from "./middlewares/error.middleware";
import { dbConnection } from "./config/db.config";
import { NODE_ENV, PORT } from "./config/const.config";
import AuthRoute from "./routes/auth.route";
import TaskRoute from "./routes/task.route";

class App {
  app: express.Application;
  env: string;
  port: string | number;

  routes: Routes[]

  constructor() {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.routes = [
      new AuthRoute(),
      new TaskRoute()
    ];

    this.env !== 'test' && this.connectToDatabase();
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
  }

  listen() {
    this.app.listen(this.port, () => {
      console.info(`=================================`);
      console.info(`======= ENV: ${this.env} =======`);
      console.info(`🚀 App listening on the port ${this.port}`);
      console.info(`=================================`);
    });
  }

  private connectToDatabase() {
    const AppDataSource = new DataSource(dbConnection)
    AppDataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!")
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err)
      })
  }

  private initializeRoutes() {
    this.routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
