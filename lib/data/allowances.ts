import { EXPO_PUBLIC_API_KEY } from '@env';
import { Transaction } from '@lib/models';
import Config from '@lib/config';
import { WrapResult, wrapFetch } from './wrap';

const headers = {
    Authorization: `Bearer ${EXPO_PUBLIC_API_KEY}`
};

export function getAllowanceTransactions(owner: string) : WrapResult<Transaction[]> {
    return wrapFetch(`${Config.ApiUrl}/allowances?owner=${owner}`, { headers });
}