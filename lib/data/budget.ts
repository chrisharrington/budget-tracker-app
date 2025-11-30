import dayjs from 'dayjs';
import { Budget, Transaction, History } from '../models';
import Config from '../config';
import { log } from '@lib/helpers/log';

export default class BudgetApi {
    static async get(date: Date): Promise<{ budget: Budget, transactions: Transaction[] }> {
        try {
            const response = await fetch(`${Config.ApiUrl}/week?date=${dayjs(date).format()}`);

            if (!response.ok)
                throw new Error(`Error while retrieving budget. ${response.status}`);

            const result = await response.json();
            const { transactions, ...budget } = result;
            transactions.forEach(t => t.tags = t.tags || []);
            return { transactions, budget };
        } catch (e) {
            log('Error fetching budget.', e);
            throw e;
        }
    }

    static async history(): Promise<History[]> {
        try {
            const response = await fetch(`${Config.ApiUrl}/history`);

            if (!response.ok)
                throw new Error(`Error while retrieving history. ${response.status}`);

            return await response.json();
        } catch (e) {
            log('Error fetching history.', e);
            throw e;
        }
    }

    static async updateTransaction(transaction: Transaction): Promise<void> {
        try {
            const response = await fetch(`${Config.ApiUrl}/transaction`, {
                method: 'POST',
                body: JSON.stringify(transaction),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });

            if (!response.ok)
                throw new Error(`Error while updating transaction. ${response.status}`);
        } catch (e) {
            log('Error updating transaction.', e);
            throw e;
        }
    }

    static async splitTransaction(transaction: Transaction, newAmount: number) {
        try {
            const response = await fetch(`${Config.ApiUrl}/transaction/split`, {
                method: 'POST',
                body: JSON.stringify({
                    transaction,
                    newAmount
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });

            if (!response.ok)
                throw new Error(`Error while splitting transaction. ${response.status}`);
        } catch (e) {
            log('Error splitting transaction.', e);
            throw e;
        }
    }
}