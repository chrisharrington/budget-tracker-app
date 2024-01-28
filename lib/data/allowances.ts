import { EXPO_PUBLIC_API_KEY } from '@env';
import { Transaction } from '@lib/models';
import Config from '@lib/config';

const headers = {
    Authorization: `Bearer ${EXPO_PUBLIC_API_KEY}`
};

export async function getAllowanceTransactions(owner: string): Promise<Transaction[]> {
    const response = await fetch(`${Config.ApiUrl}/allowances?owner=${owner}`, { headers });
    if (!response.ok)
        throw new Error(`Failed to fetch allowance transactions: ${response.status}`);

    return await response.json() as Transaction[];
}