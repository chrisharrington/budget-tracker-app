import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar as ReactStatusBar, LogBox } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeviceApi from './lib/data/device';
import Colours from './lib/colours';
import { Toast, ToastHandle } from './lib/components/toast';
import { TransactionsScreen } from '@lib/screens/transactions';
import { StateContext } from '@lib/context';
import { QuinnAllowancesScreen, ZoeAllowancesScreen } from '@lib/screens/allowances';
import { TabParamList } from '@lib/models';

LogBox.ignoreLogs(['new NativeEventEmitter()']);

const Tab = createBottomTabNavigator<TabParamList>();

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

    return <View style={styles.container}>
        <Toast ref={toast} />

        <StateContext.Provider value={{ toast: toast.current as ToastHandle }}>
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName='Transactions'
                    screenOptions={{
                        headerShown: false,
                        tabBarLabelStyle: { color: Colours.text.default, paddingBottom: 4 },
                        tabBarStyle: { backgroundColor: Colours.background.dark, borderTopWidth: 0 }
                    }}
                >
                    <Tab.Screen
                        name='Transactions'
                        component={TransactionsScreen}
                        options={{
                            tabBarIcon: () => <Ionicons name='list' color={Colours.text.default} size={22} />
                        }}
                    />

                    <Tab.Screen
                        name='Quinn'
                        component={QuinnAllowancesScreen}
                        options={{
                            tabBarIcon: () => <FontAwesome name='dollar' color={Colours.text.default} size={18} />
                        }}
                    />

                    <Tab.Screen
                        name='Zoe'
                        component={ZoeAllowancesScreen}
                        options={{
                            tabBarIcon: () => <FontAwesome name='dollar' color={Colours.text.default} size={18} />
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </StateContext.Provider>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background.default,
        flexDirection: 'column',
        paddingTop: ReactStatusBar.currentHeight
    }
});
