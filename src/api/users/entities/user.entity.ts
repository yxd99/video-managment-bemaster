import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as user from '@api/users/constants';
import { bcrypt } from '@common/utils';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: user.MAX_LENGTH_USERNAME,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: user.MAX_LENGTH_EMAIL,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: false,
    select: false,
  })
  password: string;

  @DeleteDateColumn({
    select: false,
  })
  delete_date: Date;

  checkPassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
