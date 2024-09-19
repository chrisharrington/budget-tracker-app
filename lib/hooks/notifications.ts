import { useEffect } from 'react';
import { getPermissionsAsync, requestPermissionsAsync, getExpoPushTokenAsync } from 'expo-notifications';
import Constants from 'expo-constants';
import DeviceApi from '@lib/data/device';

export function useNotifications() {
    useEffect(() => {
        (async () => {
            try {
                if (!__DEV__) {
                    let { granted } = await getPermissionsAsync();
                    if (!granted)
                        granted = (await requestPermissionsAsync()).granted;

                    if (granted) {
                        const token = await getExpoPushTokenAsync({
                            projectId: Constants.expoConfig?.extra?.eas.projectId
                        });
                        await DeviceApi.registerToken(token.data);
                    } else
                        console.error('Notifications permission not granted.');
                }
            } catch (e) {
                console.error(e);
            }
        })();
    })
}