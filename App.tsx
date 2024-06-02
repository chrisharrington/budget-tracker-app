import 'expo-dev-client';
import 'react-native-gesture-handler';

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, LogBox, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeviceApi from './lib/data/device';
import Colours from './lib/colours';
import { Toast, ToastHandle } from './lib/components/toast';
import { TransactionsScreen } from '@lib/screens/transactions';
import { StateContext } from '@lib/context';
import { QuinnAllowancesScreen, ZoeAllowancesScreen } from '@lib/screens/allowances';
import { TabParamList } from '@lib/models';

LogBox.ignoreLogs(['new NativeEventEmitter()']);

const Tab = createBottomTabNavigator<TabParamList>();

export default function App() {
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

        <StateContext.Provider value={{ toast }}>
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName='Transactions'
                    tabBar={props => <TabBar {...props} />}
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Tab.Screen
                        name='Transactions'
                        component={TransactionsScreen}
                    />

                    <Tab.Screen
                        name='Quinn'
                        component={QuinnAllowancesScreen}
                    />

                    <Tab.Screen
                        name='Zoe'
                        component={ZoeAllowancesScreen}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </StateContext.Provider>
    </View>;
}

function TabBar(props: BottomTabBarProps) {
    return <View style={styles.tabBar}>
        {props.state.routes.map((route, index) => {
            const isFocused = props.state.index === index;

            const onPress = () => {
                if (!isFocused)
                    props.navigation.navigate(route.name);
            };

            return <View key={route.key} style={styles.tabBarLabelWrapper}>
                <Text
                    style={[styles.tabBarLabel, {
                        backgroundColor: isFocused ? Colours.background.positive : Colours.background.darker,
                    }]}
                    onPress={onPress}
                >
                    {route.name}
                </Text>
            </View>;
        })}
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background.default,
        flexDirection: 'column',
        paddingTop: Constants.statusBarHeight
    },

    tabBar: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 10,
        backgroundColor: Colours.background.dark,
        borderTopWidth: 0,
    },

    tabBarLabelWrapper: {
        flex: 1,
        paddingVertical: 12
    },

    tabBarLabel: {
        color: Colours.text.default,
        padding: 10,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderRadius: 4,
        textAlign: 'center'
    }
});
