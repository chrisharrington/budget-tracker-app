import { EXPO_PUBLIC_API_KEY } from '@env';
import Config from '../config';
import { log } from '@lib/helpers/log';

export default class DeviceApi {
    static async registerToken(token: string): Promise<void> {
        try {
            const response = await fetch(`${Config.ApiUrl}/device`, {
                method: 'POST',
                body: JSON.stringify({ token }),
                headers: new Headers({
                    'Authorization': `Bearer ${EXPO_PUBLIC_API_KEY}`,
                    'Content-Type': 'application/json'
                })
            });

            if (response.status !== 200)
                throw new Error(`Error while updating device. ${response.status}`);
        } catch (e) {
            log('Error registering device token.', e);
            throw e;
        }
    }
}