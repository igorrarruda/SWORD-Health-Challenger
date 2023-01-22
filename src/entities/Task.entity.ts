import { EncryptionTransformerConfig } from '../config/encryption.config';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';
import { User } from './User.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: 'text',
    transformer: new EncryptionTransformer(EncryptionTransformerConfig)
  })
  summary: string;

  @Column({ type: 'datetime', nullable: true })
  finishedDate?: Date;

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date

  @DeleteDateColumn()
  deletedDate: Date

  @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
  user: User
}
