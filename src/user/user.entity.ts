import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isDoctor: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column('json', { default: [] })
  seenNotifications: { type: string; message: string; data: any; onClickPath: string }[];

  @Column('json', { default: [] })
  unseenNotifications: { type: string; message: string; data: any; onClickPath: string }[];

  @OneToMany(() => Doctor, doctor => doctor.user)
  doctors: Doctor[];
}
