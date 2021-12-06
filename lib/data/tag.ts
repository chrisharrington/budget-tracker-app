import dayjs from 'dayjs';

import { Tag } from '../models';
import Config from '../config';
import Secret from '../secret';

export default class TagApi {
    static async get() : Promise<Tag[]> {
        const response = await fetch(`${Config.ApiUrl}/tags/recent`, {
            headers: new Headers({
                'Authorization': Secret.apiKey
            })
        });

        if (response.status !== 200)
            throw new Error(`Error while retreiving recent tags. ${response.status}`);

        return await response.json();
    }
}