import { Budget } from '../models';
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
}