import { INewAppointmentReq } from './INewAppointmentReq';

export interface IUpdateAppointmentReq extends INewAppointmentReq {
    appointmentId: string;
}
