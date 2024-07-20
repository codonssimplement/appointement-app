import { Injectable } from '@nestjs/common';
import { Tak, TakStatus } from './taks.model';
import * as uuid from 'uuid';


@Injectable()
export class TaksService {

    private taks :Tak[] = [
        {title: 'faire le menage',description:'na set', status:TakStatus.OPEN}
    ]

    //All taks
    getAllTaks(): Tak[]{
        return this.taks
    }

    //part 1
    //Add new taks
    createTaks(title: string, description: string)
    {
        const tak : Tak={
            title,
            description,
            status:TakStatus.OPEN
        }
        //add 
           this.taks.push(tak)
          return tak
        }

}
