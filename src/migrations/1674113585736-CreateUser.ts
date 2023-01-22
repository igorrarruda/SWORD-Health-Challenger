import { Role } from "entities/Role.entity";
import { User } from "entities/User.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1674113585736 implements MigrationInterface {
    name = 'CreateUser1674113585736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`roleId\` int NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query("INSERT INTO \`role\` (id, name) VALUES (1, 'Manager'), (2, 'Technician');")
        await queryRunner.query("INSERT INTO \`user\` (id, name, email, password, roleId) VALUES ('807a350f-9cc7-4b59-bf70-f81d31d19932', 'Igor', 'igor@task.com', '$2a$10$JP6VudotqWQpNT0pbR4oR.UK5ythZB/iRsOe2FalyV8dU0no7pC5i', 1), ('4b2d2618-d6ed-4c91-8f02-e158abd844a7', 'José', 'jose@task.com', '$2a$10$JP6VudotqWQpNT0pbR4oR.UK5ythZB/iRsOe2FalyV8dU0no7pC5i', 2);")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
