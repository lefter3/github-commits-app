import { Column, Entity } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({
    type: 'varchar',
  })
  lastLogin: string;
}
