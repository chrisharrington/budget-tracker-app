import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, StatusBar as ReactStatusBar, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeviceApi from './lib/data/device';
import Colours from './lib/colours';
import { Toast, ToastHandle } from './lib/components/toast';
import { TransactionsScreen } from '@lib/screens/transactions';
import { StateContext } from '@lib/context';

LogBox.ignoreLogs(['new NativeEventEmitter()']);

type TabParamList = {
    Transactions: {},
    Allowances: {}
}

// const Tab = createBottomTabNavigator<TabParamList>();

export default () => {
    const toast = useRef<ToastHandle>(null);

    useEffect(() => {
        (async () => {
            try {
                if (!__DEV__) {
                    let { granted } = await Notifications.getPermissionsAsync();
                    if (!granted)
                        granted = (await Notifications.requestPermissionsAsync()).granted;

                    if (granted) {
                        const token = await Notifications.getExpoPushTokenAsync({
                            projectId: Constants.expoConfig?.extra?.eas.projectId
                        });
                        await DeviceApi.registerToken(token.data);
                    } else
                        console.error('Notifications permission not granted.');
                }

                await Font.loadAsync({
                    'Lato': require('./assets/Lato-Regular.ttf')
                });
            } catch (e) {
                console.error(e);
                toast.current?.error('An error has occurred while initializing the application. Please try again later.');
            }
        })();
    }, []);

    return <NavigationContainer>
        <View style={styles.container}>
            <StatusBar
                style='light'
            />

            <Toast ref={toast} />

            <StateContext.Provider value={{ toast: toast.current as ToastHandle }}>
                <TransactionsScreen />
                {/* <Tab.Navigator
                    initialRouteName='Transactions'
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Tab.Screen
                        name='Transactions'
                        component={TransactionsScreen}
                    />
                </Tab.Navigator> */}
            </StateContext.Provider>
        </View>
    </NavigationContainer>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background.default,
        flexDirection: 'column',
        paddingTop: ReactStatusBar.currentHeight
    }
});
