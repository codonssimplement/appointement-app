import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity'; 
import * as jwt from 'jsonwebtoken';
import { Doctor } from 'src/doctor/doctor.entity';
import { Appointment } from 'src/appointment/appointment.entity';
import * as moment from 'moment';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  //Registration
  async register(userData: any): Promise<{ message: string; success: boolean }> {
    try {
      //Search if user exist
      const userExists = await this.userRepository.findOne({ where: { email: userData.email } 
    });
      if (userExists) {
        return { message: 'User already exists', success: false };
      }

      //hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      userData.password = hashedPassword;

      //create a new user
      const newUser = await this.userRepository.create(userData);

      //save in the database
      await this.userRepository.save(newUser);

      return { message: 'User created successfully', success: true };
    } catch (error) {
      console.log(error);
      return { message: 'Error creating user', success: false };
    }
  }


  //LogIn
  async login(userData: any): Promise<{ message: string; success: boolean; data?: string }> {
    try {
      console.log('Starting login process');
      const user = await this.userRepository.findOne({ where: { email: userData.email } });
      console.log('User fetched:', user);
      if (!user) {
        return { message: 'Incorrect email or password', success: false };
      }

      const isMatch = await bcrypt.compare(userData.password, user.password);
      console.log('Password match:', isMatch);
      if (!isMatch) {
        return { message: 'Incorrect email or password', success: false };
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      console.log('Token generated:', token);

      return { message: 'Login successful', success: true, data: token };
    } catch (error) {
      console.log('Error during login:', error);
      return { message: 'Error logging in', success: false };
    }
  }

  //Get info by the user id
  async getUserInfoById(userId: number): Promise<{ message: string; success: boolean; data?: any }> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return { message: 'User does not exist', success: false };
      }
      user.password = undefined;
      return {message:'Show the user info here :', success: true, data: user };
    } catch (error) {
      console.log(error);
      return { message: 'Error getting user info', success: false };
    }
  }

  //Requet to change statu into doctor statu
  async applyDoctorAccount(userData: any): Promise<{ message: string; success: boolean }> {
    try {
      const newDoctor = this.doctorRepository.create({ ...userData, status: 'pending' });
      await this.doctorRepository.save(newDoctor);

      const adminUser = await this.userRepository.findOne({ where: { isAdmin: true } });
      if (!adminUser) {
        throw new Error('Only admin user can approuved a creation of doctor, Please wait for it');
      }

      const unseenNotifications = [...adminUser.unseenNotifications];
      unseenNotifications.push({
        type: 'new-doctor-request',
        message: `${newDoctor[0]} ${newDoctor[1]} has applied for a doctor account`,
        data: {
          doctorId: newDoctor[2],
          name: `${newDoctor[0]} ${newDoctor[1]}`,
        },
        onClickPath: '/admin/doctorslist',
      });

      adminUser.unseenNotifications = unseenNotifications;
      await this.userRepository.save(adminUser);

      return { message: 'Doctor account applied successfully', success: true };
    } catch (error) {
      console.error(error);
      return { message: 'Error applying doctor account', success: false };
    }
  }

  //mark all notification as open
  async markAllNotificationsAsSeen(userId: number): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      const unseenNotifications = user.unseenNotifications;
      const seenNotifications = user.seenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.unseenNotifications = [];
      user.seenNotifications = seenNotifications;
      const updatedUser = await this.userRepository.save(user);
      updatedUser.password = undefined;
      return {
        success: true,
        message: 'All notifications marked as seen',
        data: updatedUser,
      };
    } catch (error) {
      throw new Error('Error marking notifications as seen');
    }
  }

  //Delete notifications
  async deleteAllNotifications(userId: number): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      user.seenNotifications = [];
      user.unseenNotifications = [];
      const updatedUser = await this.userRepository.save(user);
      updatedUser.password = undefined;
      return {
        success: true,
        message: 'All notifications cleared',
        data: updatedUser,
      };
    } catch (error) {
      throw new Error('Error clearing notifications');
    }
  }

  //All doctor confirmed
  async getAllApprovedDoctors(): Promise<any> {
    try {
      const doctors = await this.doctorRepository.find({ where: { status: 'approved' } });
      return {
        message: 'Doctors fetched successfully',
        success: true,
        data: doctors,
      };
    } catch (error) {
      throw new Error('Error fetching approved doctors');
    }
  }

  //Book appointment
  async bookAppointment(appointmentData: any): Promise<any> {
    try {
      appointmentData.status = 'pending';
      appointmentData.date = moment(appointmentData.date, 'DD-MM-YYYY').toISOString();
      appointmentData.time = moment(appointmentData.time, 'HH:mm').toISOString();
      const newAppointment = this.appointmentRepository.create(appointmentData);
      await this.appointmentRepository.save(newAppointment);

      const user = await this.userRepository.findOne({ where: { id: appointmentData.doctorInfo.userId } });
      user.unseenNotifications.push({
        type: 'new-appointment-request',
        message: `A new appointment request has been made by ${appointmentData.userInfo.name}`,
        onClickPath: '/doctor/appointments',
        data: undefined
      });
      await this.userRepository.save(user);

      return {
        message: 'Appointment booked successfully',
        success: true,
      };
    } catch (error) {
      throw new Error('Error booking appointment');
    }
  }

  //Verify appointment availability
  async checkBookingAvailability(doctorId: number, date: string, time: string): Promise<boolean> {
    const parsedDate = moment(date, 'DD-MM-YYYY').toISOString();
    const fromTime = moment(time, 'HH:mm').subtract(1, 'hours').toISOString();
    const toTime = moment(time, 'HH:mm').add(1, 'hours').toISOString();

    const appointments = await this.appointmentRepository.find({
      where: {
        doctorId,
        date: parsedDate,
        time: Between(fromTime, toTime),

      },
    });

    return appointments.length === 0;
  }

  //All appointment by user id
  async getAppointmentsByUserId(userId: number): Promise<any> {
    try {
      const appointments = await this.appointmentRepository.find({ where: { userId } });
      return {
        message: 'Appointments fetched successfully',
        success: true,
        data: appointments,
      };
    } catch (error) {
      throw new Error('Error fetching appointments');
    }
  }

  
}
