
import { join } from 'path';
import sqlite3 from 'sqlite3';
import { DataSource } from 'typeorm';
import fs from 'fs';

export class TestHelper {

  private static _instance: TestHelper;

  private constructor() { }

  public static get instance(): TestHelper {
    if (!this._instance) this._instance = new TestHelper();

    return this._instance;
  }

  private dataSource!: DataSource;
  private testdb!: sqlite3.Database;
  private databaseFilePath = "dump.sql"

  async setupTestDB() {
    sqlite3.verbose();
    this.testdb = new sqlite3.Database(this.databaseFilePath);

    this.dataSource = new DataSource({
      name: 'test',
      type: 'sqlite',
      database: this.databaseFilePath,
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      synchronize: true,
      // logger: "simple-console",
      // logging: ["query", "error"]
    });
    await this.dataSource.initialize();
    await this.dataSource.manager.query("INSERT INTO role (id, name) VALUES (1, 'Manager'), (2, 'Technician');")
  }

  async teardownTestDB() {
    await this.dataSource.destroy();
    this.testdb.close();
    fs.unlinkSync(this.databaseFilePath)

  }

}
