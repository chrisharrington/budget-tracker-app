import { OneTime } from '../models';
import Config from '../config';

export default class OneTimeApi {
    static async get() : Promise<OneTime> {
        const response = await fetch(`${Config.ApiUrl}/one-time/balance`, {
            headers: new Headers({
                'Authorization': process.env.EXPO_PUBLIC_API_KEY as string
            })
        });

        if (!response.ok)
            throw new Error(`Error while retrieving the one-time balance. ${response.status}`);
        
        return await response.json();
    }
}