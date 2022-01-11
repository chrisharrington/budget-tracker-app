import React from 'react';
import { StyleSheet, View, StatusBar as ReactStatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';

import DeviceApi from './lib/data/device';

import Colours from './lib/colours';

import { Transaction, Budget, History } from './lib/models';

import { Toast, ToastType } from './lib/components/toast';

import BalanceView from './lib/views/balance';


export default () => {
    const [fontsLoaded] = useFonts({
        'Lato': Lato_400Regular
    });

    return fontsLoaded ? <App /> : <AppLoading />;
}


interface AppState {
    ready: boolean;
    budget: Budget | null;
    loading: boolean;
    histories: History[];
    toastMessage: string;
    toastType: ToastType;
    selectedTransaction: Transaction | null;
    blah: boolean;
}

class App extends React.Component<{}, AppState> {
    private toast: Toast;

    state = {
        ready: false,
        budget: null,
        loading: false,
        histories: [],
        toastMessage: '',
        toastType: ToastType.Success,
        selectedTransaction: null,
        blah: false
    }

    async componentDidMount() {
        if (!__DEV__) {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            if (status === Permissions.PermissionStatus.GRANTED) {
                const token = await Notifications.getExpoPushTokenAsync();
                await DeviceApi.registerToken(token.data);
            }
        }

        this.setState({ ready: true });
    }

    render() {
        return this.state.ready ? <View style={styles.container}>
            <StatusBar
                style='light'
            />

            <BalanceView
                onError={(message: string) => this.toast.error(message)}
            />

            <Toast
                ref={c => this.toast = c as Toast}
            />
        </View> : <AppLoading />;
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
        left: 0,
        right: 0,
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
