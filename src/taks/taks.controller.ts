import { Body, Controller, Get, Post } from '@nestjs/common';
import { TaksService } from './taks.service';
import { Tak } from './taks.model';

@Controller('taks')
export class TaksController {
    constructor(private takesServices : TaksService){}


    //All takes return
    @Get()
    getAllTaks():Tak[]{
        return this.takesServices.getAllTaks
        ()
    }


    //Part 2
    @Post()
    createTaks(@Body() body)
    {
        console.log('body', body)

    }

}
