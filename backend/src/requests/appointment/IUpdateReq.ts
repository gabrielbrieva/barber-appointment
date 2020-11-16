import { ICreateReq } from "./ICreateReq";

export interface IUpdateReq extends ICreateReq {
    appointmentId: string;
}