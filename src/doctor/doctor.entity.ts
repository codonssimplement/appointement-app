import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, FindOperator } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Doctor {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  status: string;

  @ManyToOne(() => User, user => user.doctors)
  user: User;
    userId: number | FindOperator<number>;
}
