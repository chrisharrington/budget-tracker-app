import dayjs from 'dayjs';
import { EXPO_PUBLIC_API_KEY } from '@env';
import { Budget, Transaction, History } from '../models';
import Config from '../config';

export default class BudgetApi {
    static async get(date: Date) : Promise<{ budget: Budget, transactions: Transaction[] }> {
        const response = await fetch(`${Config.ApiUrl}/week?date=${dayjs(date).format()}`, {
            headers: new Headers({
                'Authorization': `Bearer ${EXPO_PUBLIC_API_KEY}`
            })
        });

        if (!response.ok)
            throw new Error(`Error while retreiving budget. ${response.status}`);

        const result = await response.json();
        const { transactions, ...budget } = result;
        transactions.forEach(t => t.tags = t.tags || []);
        return { transactions, budget };
    }

    static async history() : Promise<History[]> {
        const response = await fetch(`${Config.ApiUrl}/history`, {
            headers: new Headers({
                'Authorization': `Bearer ${EXPO_PUBLIC_API_KEY}`
            })
        });

        if (!response.ok)
            throw new Error(`Error while retrieving history. ${response.status}`);

        return await response.json();
    }

    static async updateTransaction(transaction: Transaction) : Promise<void> {
        const response = await fetch(`${Config.ApiUrl}/transaction`, {
            method: 'POST',
            body: JSON.stringify(transaction),
            headers: new Headers({
                'Authorization': `Bearer ${EXPO_PUBLIC_API_KEY}`,
                'Content-Type': 'application/json'
            })
        });

        if (!response.ok)
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
                'Authorization': `Bearer ${EXPO_PUBLIC_API_KEY}`,
                'Content-Type': 'application/json'
            })
        });

        if (!response.ok)
            throw new Error(`Error while splitting transaction. ${response.status}`);
    }
}