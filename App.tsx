import React from 'react';
import { StyleSheet, View, Text, StatusBar as ReactStatusBar, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { AppLoading } from 'expo';
import { StatusBar } from 'expo-status-bar';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DeviceApi from './lib/data/device';

import Colours from './lib/colours';

import { Toast, ToastType } from './lib/components/toast';

import BalanceView from './lib/views/balance';
import HistoryView from './lib/views/history';


const Tab = createBottomTabNavigator();

export default () => {
    const [fontsLoaded] = useFonts({
        'Lato': Lato_400Regular
    });

    return fontsLoaded ? <App /> : <AppLoading />;
}


interface IAppState {
    toastMessage: string;
    toastType: ToastType;
    appState: AppStateStatus;
}

class App extends React.Component<{}, IAppState> {
    private toast: Toast;

    state = {
        toastMessage: '',
        toastType: ToastType.Success,
        appState: AppState.currentState
    }

    async componentDidMount() {
        if (!__DEV__) {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            if (status === Permissions.PermissionStatus.GRANTED) {
                const token = await Notifications.getExpoPushTokenAsync();
                await DeviceApi.registerToken(token.data);
            }
        }

        AppState.addEventListener('change', async (nextState: AppStateStatus) => {
            this.setState({ appState: nextState });
        });
    }

    render() {
        return <View style={styles.container}>
            <StatusBar
                style='light'
            />

            <NavigationContainer>
                <Tab.Navigator
                    tabBar={props => <TabBar {...props} />}
                >
                    <Tab.Screen name='Balance' children={() => <BalanceView
                        style={{ marginBottom: 60 }}
                        appState={this.state.appState}
                        onError={(message: string) => this.toast.error(message)}
                    />} />
                    <Tab.Screen name='History' children={() => <HistoryView
                        style={{ marginBottom: 60 }}
                        appState={this.state.appState}
                        onError={(message: string) => this.toast.error(message)}
                    />} />
                </Tab.Navigator>
            </NavigationContainer>

            <Toast
                ref={c => this.toast = c as Toast}
            />
        </View>;
    }
}


class TabBar extends React.Component<any> {
    render() {
        return <View style={styles.tabBar}>
            {this.props.state.routes.map((route, index) => (
                <TouchableOpacity
                    key={route.key}
                    style={[styles.tabButton, index === 0 ? styles.tabButtonFirst : null]}
                    activeOpacity={1}
                    onPress={() => this.onPress(route, index)}
                >
                    <Text style={[styles.tabButtonText, , index === this.props.state.index ? styles.tabButtonTextSelected : null]}>{route.name}</Text>
                </TouchableOpacity>
            ))}
        </View>;
    }

    private onPress(route, index) {
        const event = this.props.navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!event.defaultPrevented && this.props.state.index !== index)
            this.props.navigation.navigate(route.name);
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background.default,
        flexDirection: 'column',
        paddingTop: ReactStatusBar.currentHeight
    },

    tabBar: {
        backgroundColor: Colours.background.dark,
        height: 60,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row'
    },

    tabButton: {
        flex: 1,
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: Colours.background.default
    },

    tabButtonFirst: {
        borderLeftWidth: 0
    },

    tabButtonText: {
        color: Colours.text.default,
        textTransform: 'uppercase',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Lato',
        marginTop: 15,
        paddingBottom: 3
    },

    tabButtonTextSelected: {
        borderBottomWidth: 2,
        borderBottomColor: Colours.highlight.default
    }
});
