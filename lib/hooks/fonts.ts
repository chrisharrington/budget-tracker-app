import { useEffect } from 'react';
import { loadAsync } from 'expo-font';
import { log } from '@lib/helpers/log';

export function useFonts() {
    useEffect(() => {
        (async () => {
            try {
                await loadAsync({
                    'Lato': require('@assets/Lato-Regular.ttf')
                });
            } catch (e) {
                log('Error loading fonts.', e);
            }
        })();
    }, []);
}