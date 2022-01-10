import dayjs from 'dayjs';


import { Budget, Transaction, History } from '../models';
import Config from '../config';
import Secret from '../secret';

export default class BudgetApi {
    static async get(date: Date) : Promise<{ budget: Budget, transactions: Transaction[] }> {
        const response = await fetch(`${Config.ApiUrl}/week?date=${dayjs(date).format('YYYY-MM-DD')}`, {
            headers: new Headers({
                'Authorization': Secret.apiKey
            })
        });

        if (response.status !== 200)
            throw new Error(`Error while retreiving budget. ${response.status}`);

        const result = await response.json();
        const { transactions, ...budget } = result;
        transactions.forEach(t => t.tags = t.tags || []);
        return { transactions, budget };
    }

    static async history() : Promise<History[]> {
        const response = await fetch(`${Config.ApiUrl}/history`, {
            headers: new Headers({
                'Authorization': Secret.apiKey
            })
        });

        if (response.status !== 200)
            throw new Error(`Error while retrieving history. ${response.status}`);

        return await response.json();
    }

    static async updateTransaction(transaction: Transaction) : Promise<void> {
        const response = await fetch(`${Config.ApiUrl}/transaction`, {
            method: 'POST',
            body: JSON.stringify(transaction),
            headers: new Headers({
                'Authorization': Secret.apiKey,
                'Content-Type': 'application/json'
            })
        });

        if (response.status !== 200)
            throw new Error(`Error while updating transaction. ${response.status}`);
    }

    static async splitTransaction(transaction: Transaction, newAmount: number) {
        const response = await fetch(`${Config.ApiUrl}/transaction/split`, {
            method: 'POST',
            body: JSON.stringify({
                transaction,
                newAmount
            }),
            headers: new Headers({
                'Authorization': Secret.apiKey,
                'Content-Type': 'application/json'
            })
        });

        if (response.status !== 200)
            throw new Error(`Error while splitting transaction. ${response.status}`);
    }
}