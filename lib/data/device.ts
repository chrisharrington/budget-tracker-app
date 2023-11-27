import { EXPO_PUBLIC_API_KEY } from '@env';
import Config from '../config';

export default class DeviceApi {
    static async registerToken(token: string) : Promise<void> {
        const response = await fetch(`${Config.ApiUrl}/device`, {
            method: 'POST',
            body: JSON.stringify({ token }),
            headers: new Headers({
                'Authorization': EXPO_PUBLIC_API_KEY,
                'Content-Type': 'application/json'
            })
        });

        if (response.status !== 200)
            throw new Error(`Error while updating device. ${response.status}`);
    }
}