import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';

import { UserService } from 'src/user/user.service';
import { AdminGuard } from './admin.guard';


@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService,
    private readonly userService: UserService) {}

    //Become Admin
  @Post('user-to-admin')
  @UseGuards(AdminGuard)
  async promoteToAdmin(@Body('userId') userId: number) {
    const user = await this.adminService.promoteToAdmin(userId)
    return {
      success: true,
      message: 'User promoted to admin successfully',
      data: user,
    };
  }

  //Get all doctors
  @Get('all-doctors')
  @UseGuards(JwtAuthGuard)
  async getAllDoctors() {
    return this.adminService.getAllDoctors();
  }

  //Get all users
  @Get('all-users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  //Active account doctors
  @Post('active-doctors-account')
  @UseGuards(JwtAuthGuard)
  async changeDoctorAccountStatus(@Body() changeStatusDto: { doctorId: number, status: string }) {
    const { doctorId, status } = changeStatusDto;
    return this.adminService.changeDoctorAccountStatus(doctorId, status);
  }
}
