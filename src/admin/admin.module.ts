import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Doctor } from '../doctor/doctor.entity';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { Appointment } from 'src/appointment/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, User, Appointment])],
  providers: [AdminService, JwtService, UserService, DoctorService],
  controllers: [AdminController],
})
export class AdminModule {}
