import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';

@Controller('doctor')
export class DoctorController {

  constructor(private readonly doctorService: DoctorService) {}

  
  //Get all informations of doctor by his user id
  @Post('doctor-info-by-user-id')
  @UseGuards(JwtAuthGuard)
  async getDoctorInfoByUserId(@Body('userId') userId: number) {
    return this.doctorService.getDoctorInfoByUserId(userId);
  }

  //Get all informations of doctor by his id
  @Post('get-doctor-info-by-id')
  @UseGuards(JwtAuthGuard)
  async getDoctorInfoById(@Body('doctorId') doctorId: string) {
    return this.doctorService.getDoctorInfoById(doctorId);
  }

  //Update doctor profil
  @Post('update-doctor-profile')
  @UseGuards(JwtAuthGuard)
  async updateDoctorProfile(@Body('userId') userId:number, @Body() updateData: any) {
    return this.doctorService.updateDoctorProfile(userId, updateData);
  }

  //Appointment by doctor id
  @Get('appointments-by-doctor-id')
  @UseGuards(JwtAuthGuard)
  async getAppointmentsByDoctorId(@Body('userId') userId:number) {
    return this.doctorService.getAppointmentsByDoctorId(userId);
  }

  //Update appointment statu
  @Post('change-appointment-status')
  @UseGuards(JwtAuthGuard)
  async changeAppointmentStatus(@Body('appointmentId') appointmentId: string, @Body('status') status: string) {
    return this.doctorService.changeAppointmentStatus(appointmentId, status);
  }
}
