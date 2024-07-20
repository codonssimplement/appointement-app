import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Doctor } from 'src/doctor/doctor.entity';
import { Appointment } from 'src/appointment/appointment.entity';
import { DoctorService } from 'src/doctor/doctor.service';

@Module({
  imports:[TypeOrmModule.forFeature([User, Doctor, Appointment])],
  providers: [UserService, JwtService, DoctorService],
  controllers: [UserController]
})
export class UserModule {}
