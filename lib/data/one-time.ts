import { OneTime } from '../models';
import Config from '../config';
import Secret from '../secret';

export default class OneTimeApi {
    static async get() : Promise<OneTime> {
        const response = await fetch(`${Config.ApiUrl}/one-time/balance`, {
            headers: new Headers({
                'Authorization': Secret.apiKey as string
            })
        });

        if (!response.ok)
            throw new Error(`Error while retrieving the one-time balance. ${response.status}`);
        
        return await response.json();
    }
}