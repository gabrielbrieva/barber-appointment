export interface IAppointmentItem {
    userId: string;
    appointmentId: string;
    barberId: string;
    serviceId: string;
    date: string;
    time: string;
    done: boolean;
    score?: number;
    comment?: string;
    beforeImg?: string;
    afterImg?: string;
}