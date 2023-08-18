export class Id {
    _id: string;
}

export class Budget {
    date: Date;
    weeklyAmount: number;
    balance: number | undefined;
    
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
    balance: boolean;
    tags: Tag[];

    constructor() {
        super();
        this.tags = [];
    }
}

export class History {
    date: Date;
    balance: number;
}

export class Tag extends Id {
    name: string;
    ignore: boolean;
    defaults: string[];
    updated: Date
}

export class OneTime extends Id {
    balance: number;
}