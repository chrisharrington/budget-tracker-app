import { useEffect } from 'react';
import { loadAsync } from 'expo-font';

export function useFonts() {
    useEffect(() => {
        (async () => {
            try {
                await loadAsync({
                    'Lato': require('@assets/Lato-Regular.ttf')
                });
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);
}