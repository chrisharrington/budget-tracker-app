import Config from '@lib/config';

export async function log(message: string, error?: unknown) : Promise<void> {
    if (error) console.error(message, error);
    else console.log(message);

    await fetch(`${Config.ApiUrl}/log`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: message,
    });
}