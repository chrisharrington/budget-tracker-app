import { Budget, Transaction } from '../models';
import Config from '../config';
import Secret from '../secret';

export default class BudgetApi {
    static async get() : Promise<Budget> {
        const response = await fetch(Config.ApiUrl, {
            headers: new Headers({
                'Authorization': Secret.apiKey
              })
        });

        if (response.status !== 200)
            throw new Error(`Error while retreiving budget. ${response.status}`);

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
}