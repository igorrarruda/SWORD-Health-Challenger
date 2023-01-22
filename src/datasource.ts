import { dbConnection } from "./config/db.config";
import { DataSource } from "typeorm";

const datasource = new DataSource(dbConnection);
datasource.initialize();
export default datasource; 