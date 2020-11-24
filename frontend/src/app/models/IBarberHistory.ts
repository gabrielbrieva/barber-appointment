export interface IBarberHistory {
    userName: string;
    barberName: string;
    serviceName: string;
    date: Date;
    score?: number;
    comment?: string;
    beforeImg?: string;
    afterImg?: string;
}
