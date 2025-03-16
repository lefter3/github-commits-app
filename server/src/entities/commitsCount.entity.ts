import { Column, Entity } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Entity()
export class CommitCount extends BaseEntity {
  @Column({ type: 'int' })
  count: number;

  @Column({ type: 'varchar' })
  repo: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  commitsDate: string;
}
