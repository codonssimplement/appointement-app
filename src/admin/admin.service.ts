import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  
   //Become Admin
  async promoteToAdmin(id: number): Promise<User> {
    const user = await this.userRepository.findOne({where :{id}});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isAdmin = true;
    return await this.userRepository.save(user);
  }

  //All doctors
  async getAllDoctors(): Promise<any> {
    try {
      const doctors = await this.doctorRepository.find();
      return {
        message: 'Doctors fetched successfully',
        success: true,
        data: doctors,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching doctors');
    }
  }


  //All users
  async getAllUsers(): Promise<any> {
    try {
      const users = await this.userRepository.find();
      return {
        message: 'Users fetched successfully',
        success: true,
        data: users,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching users');
    }
  }

  //Become admin
  async changeDoctorAccountStatus(doctorId: number, status: string): Promise<any> {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id: doctorId } });
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      doctor.status = status;
      await this.doctorRepository.save(doctor);

      const user = await this.userRepository.findOne({ where: { id: doctor.userId } });
      if (!user) {
        throw new Error('User not found');
      }
      
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
          type: 'new-doctor-request-changed',
          message: `Your doctor account has been ${status}`,
          onClickPath: '/notifications',
          data: undefined
      });
      
      user.isDoctor = status === 'approved';
      await this.userRepository.save(user);

      return {
        message: 'Doctor status updated successfully',
        success: true,
        data: doctor,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error updating doctor status');
    }
  }
}
