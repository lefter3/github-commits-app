import { Column, Entity } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Entity()
export class Tokens extends BaseEntity {
  @Column({ type: 'varchar'})
  code: string;

  @Column({
    type: 'varchar',
  })
  token: string;
}
