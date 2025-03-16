import { Column, Entity } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: Date })
  commitCountLastUpdate: Date;
}
