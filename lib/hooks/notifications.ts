import { useEffect } from 'react';
import { getPermissionsAsync, requestPermissionsAsync, getExpoPushTokenAsync } from 'expo-notifications';
import Constants from 'expo-constants';
import DeviceApi from '@lib/data/device';
import { log } from '@lib/helpers/log';

export function useNotifications() {
    useEffect(() => {
        (async () => {
            try {
                console.log('Checking notification permissions...');

                let { granted } = await getPermissionsAsync();
                if (!granted) {
                    console.log('Requesting notification permissions...');
                    granted = (await requestPermissionsAsync()).granted;
                }

                console.log('Notification permissions:', granted);

                if (granted) {
                    console.log('Registering for notifications...');
                    const token = await getExpoPushTokenAsync({
                        projectId: Constants.expoConfig?.extra?.eas.projectId
                    });
                    console.log('Notification token:', token.data);
                    await DeviceApi.registerToken(token.data);
                } else
                    log('Notifications permission not granted.');
            } catch (e) {
                log('Error setting up notifications.', e);
            }
        })();
    })
}