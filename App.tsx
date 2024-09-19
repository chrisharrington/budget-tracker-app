import 'expo-dev-client';
import 'react-native-gesture-handler';

import React, { useRef } from 'react';
import { StyleSheet, View, LogBox, Text } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colours from './lib/colours';
import { Toast, ToastHandle } from './lib/components/toast';
import { TransactionsScreen } from '@lib/screens/transactions';
import { StateContext } from '@lib/context';
import { QuinnAllowancesScreen, ZoeAllowancesScreen } from '@lib/screens/allowances';
import { TabParamList } from '@lib/models';
import { StatusBar } from 'expo-status-bar';
import { useNotifications } from '@lib/hooks/notifications';
import { useFonts } from '@lib/hooks/fonts';

LogBox.ignoreLogs(['new NativeEventEmitter()']);

const Tab = createBottomTabNavigator<TabParamList>();

export default function App() {
    const toast = useRef<ToastHandle>(null);

    useNotifications();
    useFonts();

    return <View style={styles.container}>
        <StatusBar backgroundColor='#2a2a2a' style='light' />
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