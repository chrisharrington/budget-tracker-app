import Config from '../config';
import Secret from '../secret';

export default class DeviceApi {
    static async registerToken(token: string) : Promise<void> {
        const response = await fetch(`${Config.ApiUrl}/device`, {
            method: 'POST',
            body: JSON.stringify({ token }),
            headers: new Headers({
                'Authorization': Secret.apiKey as string,
                'Content-Type': 'application/json'
            })
        });

        if (response.status !== 200)
            throw new Error(`Error while updating device. ${response.status}`);
    }
}