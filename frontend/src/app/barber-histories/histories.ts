export interface IBarber {
    id: string;
    name: string;
}

export interface IBarberHistory {
    userName: string;
    barber: IBarber;
    jobName: string;
    date: Date;
    score?: number;
    comment?: string;
    beforeImg?: string;
    afterImg?: string;
}

export const Histories: IBarberHistory[] = [
    {
        userName: 'John Snow',
        barber: {
            id: 'barber01',
            name: 'The Barber'
        },
        jobName: 'Hair Cut',
        date: new Date('2020/10/09'),
        comment: 'Great job done by the barber, fast, clean and detailed',
        score: 4
    },
    {
        userName: 'John Snow',
        barber: {
            id: 'barber01',
            name: 'The Barber'
        },
        jobName: 'Shave',
        date: new Date()
    },
    {
        userName: 'John Snow',
        barber: {
            id: 'barber01',
            name: 'The Barber'
        },
        jobName: 'Shave',
        date: new Date()
    }
];
