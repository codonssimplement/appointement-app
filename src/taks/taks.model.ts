    export interface Tak{
        title:string;
        description:string;
        status?:TakStatus;
    }

    export enum TakStatus{
        OPEN = 'OPEN',
        IN_PROGRESS = 'IN_PROGRESS',
        DONE= 'DONE'
    }