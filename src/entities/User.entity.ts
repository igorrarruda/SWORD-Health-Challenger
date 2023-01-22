import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, OneToMany } from 'typeorm';
import { Role } from './Role.entity';
import { Task } from './Task.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}