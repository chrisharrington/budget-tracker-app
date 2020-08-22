export class Id {
    _id: string;
}

export class Budget {
    weeklyAmount: number;
    lastWeekRemaining: number;
    transactions: Transaction[];
    
    constructor(initializer: Partial<Budget>) {
        Object.assign(this, initializer);
    }
}

export class Transaction extends Id {
    amount: number;
    date: Date;
    description: string;
    owner: string;
    ignored: boolean;
}