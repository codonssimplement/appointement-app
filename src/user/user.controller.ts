import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { DoctorService } from 'src/doctor/doctor.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Registration
  @Post('register')
  async register(@Body() userData:User) {
    const result = await this.userService.register(userData);
    return result;
  }

  //LogIn
  @Post('login')
  async login(@Body() userData: any) {
    const result = await this.userService.login(userData);
    return result;
  }

  //Get Info on the user
  @Post('user-infos')
  @UseGuards(JwtAuthGuard)
  async getUserInfoById(@Body('userId') userId: number) {
    const result = await this.userService.getUserInfoById(userId);
    return result;
  }

  //Requet to change statu into doctor statu
  @Post('apply-doctor-account')
  @UseGuards(JwtAuthGuard)
  async applyDoctorAccount(@Body() userData: any) {
    const result = await this.userService.applyDoctorAccount(userData)
    return result;
  }

  //MENAGE NOTIFICATIONS//


  //mark all notification as open
  @Post('mark-all-notifications-as-seen')
  @UseGuards(JwtAuthGuard)
  async markAllNotificationsAsSeen(@Body('userId') userId: number) {
    return this.userService.markAllNotificationsAsSeen(userId);
  }

  //Delete notifications
  @Post('delete-all-notifications')
  @UseGuards(JwtAuthGuard)
  async deleteAllNotifications(@Body('userId') userId: number) {
    return this.userService.deleteAllNotifications(userId);
  }

  //All doctor confirmed
  @Get('doctors-approved')
  @UseGuards(JwtAuthGuard)
  async getAllApprovedDoctors() {
    return this.userService.getAllApprovedDoctors();
  }

  //Book appointment
  @Post('book-appointment')
  @UseGuards(JwtAuthGuard)
  async bookAppointment(@Body() appointmentData: any) {
    return this.userService.bookAppointment(appointmentData);
  }

  //Verify appointment availability
  @Post('verify-appointment-availability')
  @UseGuards(JwtAuthGuard)
  async checkBookingAvailability(@Body() body: { doctorId: number; date: string; time: string }) {
    const isAvailable = await this.userService.checkBookingAvailability(body.doctorId, body.date, body.time);
    return {
      success: isAvailable,
      message: isAvailable ? 'Appointments available' : 'Appointments not available',
    };
  }

  //All appointment by user id
  @Get('appointments-by-user-id')
  @UseGuards(JwtAuthGuard)
  async getAppointmentsByUserId(@Body('userId') userId: number) {
    return this.userService.getAppointmentsByUserId(userId);
  }

 
}
