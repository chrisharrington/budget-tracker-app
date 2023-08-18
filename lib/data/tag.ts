import { Tag } from '../models';
import Config from '../config';

export default class TagApi {
    static async get() : Promise<Tag[]> {
        const response = await fetch(`${Config.ApiUrl}/tags/recent`, {
            headers: new Headers({
                'Authorization': process.env.EXPO_PUBLIC_API_KEY as string
            })
        });

        if (response.status !== 200)
            throw new Error(`Error while retreiving recent tags. ${response.status}`);

        return await response.json();
    }
}