export interface IBarberHistory {
    userName: string;
    barberName: string;
    type: string;
    date: Date;
    score?: number;
    comment?: string;
    beforeImg?: string;
    afterImg?: string;
}

export const Histories: IBarberHistory[] = [
    {
        userName: 'John Snow',
        barberName: 'The Barber',
        type: 'Air Cut',
        date: new Date()
    },
    {
        userName: 'John Snow',
        barberName: 'The Barber',
        type: 'Shave',
        date: new Date()
    }
];
