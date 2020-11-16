export interface IAppointmentItem {
    userId: string; // hash
    appointmentId: string; // range

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