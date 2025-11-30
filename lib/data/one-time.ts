import { EXPO_PUBLIC_API_KEY } from '@env';
import { OneTime } from '../models';
import Config from '../config';
import { log } from '@lib/helpers/log';

export default class OneTimeApi {
    static async get(): Promise<OneTime> {
        try {
            const response = await fetch(`${Config.ApiUrl}/one-time/balance`, {
                headers: new Headers({
                    'Authorization': `Bearer ${EXPO_PUBLIC_API_KEY}`
                })
            });

            if (!response.ok)
                throw new Error(`Error while retrieving the one-time balance. ${response.status}`);

            return await response.json();
        } catch (e) {
            log('Error fetching one-time balance.', e);
            throw e;
        }
    }
}