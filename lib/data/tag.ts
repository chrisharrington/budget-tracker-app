import { EXPO_PUBLIC_API_KEY } from '@env';
import { Tag } from '../models';
import Config from '../config';
import { log } from '@lib/helpers/log';

export default class TagApi {
    static async get(): Promise<Tag[]> {
        try {
            const response = await fetch(`${Config.ApiUrl}/tags/recent`, {
                headers: new Headers({
                    'Authorization': `Bearer ${EXPO_PUBLIC_API_KEY}`
                })
            });

            if (response.status !== 200)
                throw new Error(`Error while retreiving recent tags. ${response.status}`);

            return await response.json();
        } catch (e) {
            log('Error fetching tags.', e);
            throw e;
        }
    }
}