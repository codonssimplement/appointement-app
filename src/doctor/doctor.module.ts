import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.entity';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Appointment } from 'src/appointment/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, User,Appointment])],
  controllers: [DoctorController],
  providers: [DoctorService, JwtService],
})
export class DoctorModule {}
