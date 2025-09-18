import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  Timestamp,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.categories)
  addedBy: UserEntity;
}
