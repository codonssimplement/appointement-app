// src/doctor/doctor.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

import { User } from '../user/user.entity';
import { Appointment } from 'src/appointment/appointment.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

 

  //Get all informations of doctor by his user id
  async getDoctorInfoByUserId(userId: number): Promise<any> {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { userId } });
      return {
        success: true,
        message: 'Doctor info fetched successfully',
        data: doctor,
      };
    } catch (error) {
      throw new Error('Error getting doctor info');
    }
  }

    //Get all informations of doctor by his id
  async getDoctorInfoById(doctorId: string): Promise<any> {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id: parseInt(doctorId, 10) } });
      return {
        success: true,
        message: 'Doctor info fetched successfully',
        data: doctor,
      };
    } catch (error) {
      throw new Error('Error getting doctor info');
    }
  }

    //Update doctor profil
  async updateDoctorProfile(userId: number, updateData: any): Promise<any> {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { userId } });
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      await this.doctorRepository.update({ userId }, updateData);
      return {
        success: true,
        message: 'Doctor profile updated successfully',
        data: doctor,
      };
    } catch (error) {
      throw new Error('Error updating doctor profile');
    }
  }

    //Appointment by doctor id
  async getAppointmentsByDoctorId(userId: number): Promise<any> {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { userId } });
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      const appointments = await this.appointmentRepository.find({ where: { doctorId: doctor.id } });
      return {
        message: 'Appointments fetched successfully',
        success: true,
        data: appointments,
      };
    } catch (error) {
      throw new Error('Error fetching appointments');
    }
  }

  //Update appointment statu
  async changeAppointmentStatus(appointmentId: string, status: string): Promise<any> {
    try {
      const appointment = await this.appointmentRepository.findOne({ where: { id: parseInt(appointmentId, 10) } });
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      appointment.status = status;
      await this.appointmentRepository.save(appointment);

      const user = await this.userRepository.findOne({ where: { id: appointment.userId } });
      if (!user) {
        throw new Error('User not found');
      }

      user.unseenNotifications.push({
          type: 'appointment-status-changed',
          message: `Your appointment status has been ${status}`,
          onClickPath: '/appointments',
          data: undefined
      });

      await this.userRepository.save(user);

      return {
        message: 'Appointment status updated successfully',
        success: true,
      };
    } catch (error) {
      throw new Error('Error changing appointment status');
    }
  }
}

