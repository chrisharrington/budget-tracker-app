import React from 'react';
import { StyleSheet, Text, View, StatusBar as ReactStatusBar, ScrollView, RefreshControl, Platform } from 'react-native';
import { AppLoading } from 'expo';
import { StatusBar } from 'expo-status-bar';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';

import BudgetApi from './lib/data/budget';
import DeviceApi from './lib/data/device';

import { Budget, Transaction } from './lib/models';
import Colours from './lib/colours';

import Progress from './lib/components/progress';
import Transactions from './lib/components/transactions';
import { Toast, ToastType } from './lib/components/toast';
import CurrencyHelpers from './lib/helpers/currency';

export default () => {
    const [fontsLoaded] = useFonts({
        'Lato': Lato_400Regular
    });

    return fontsLoaded ? <App /> : <AppLoading />;
}


interface IAppState {
    budget: Budget | null;
    loading: boolean;
    refreshing: boolean;

    toastMessage: string;
    toastType: ToastType;
}

class App extends React.Component<{}, IAppState> {
    private toast: Toast;

    state = {
        budget: null,
        loading: false,
        refreshing: false,
        toastMessage: '',
        toastType: ToastType.Success
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status === Permissions.PermissionStatus.GRANTED) {
            const token = await Notifications.getExpoPushTokenAsync();
            await DeviceApi.registerToken(token.data);
        }

        await this.getBudget();
    }

    render() {
        const budget = this.state.budget as Budget | null;
        if (budget == null)
            return <View />;

        const amount = budget.weeklyAmount - budget.transactions.filter(b => !b.ignored).map(b => b.amount).reduce((sum, amount) => sum + amount, 0);
        return <View style={styles.container}>
            <StatusBar
                style='light'
            />

            <ScrollView
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={async () => await this.getBudget()}/>}
            >
                <View style={styles.lastWeekContainer}>
                    <Text style={styles.lastWeekText}>Last week's remaining balance:</Text>
                    <Text style={styles.lastWeekAmount}>{CurrencyHelpers.format(budget.lastWeekRemaining)}</Text>
                </View>

                <Progress
                    budget={budget}
                    amount={amount}
                />

                <Transactions
                    budget={budget}
                    onTransactionToggled={(transaction: Transaction) => this.onTransactionChanged(transaction)}
                />
            </ScrollView>

            <Toast
                ref={c => this.toast = c as Toast}
            />
        </View>;
    }

    private async getBudget() {
        try {
            this.setState({
                budget: await BudgetApi.get()
            });
        } catch (e) {
            console.log(e);
            this.toast.error('An error has occurred while retreiving this week\'s budget. Please try again later.');
        }
    }

    private async onTransactionChanged(transaction: Transaction) {
        try {
            transaction.ignored = !transaction.ignored;
            this.setState({ budget: this.state.budget });
            await BudgetApi.updateTransaction(transaction);
        } catch (e) {
            console.log(e);
            this.toast.error('An error has occurred while updating the transaction. Please try again later.');

            transaction.ignored = !transaction.ignored;
            this.setState({
                budget: this.state.budget
            });
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background.default,
        flexDirection: 'column',
        paddingTop: ReactStatusBar.currentHeight
    },

    lastWeekContainer: {
        width: '100%',
        marginTop: 25,
        paddingLeft: 25,
        paddingRight: 25,
        flexDirection: 'row'
    },

    lastWeekText: {
        flex: 3,
        fontSize: 12,
        color: Colours.text.lowlight,
        fontFamily: 'Lato'
    },

    lastWeekAmount: {
        flex: 1,
        fontSize: 12,
        color: Colours.text.default,
        textAlign: 'right',
        fontFamily: 'Lato'
    }
});
