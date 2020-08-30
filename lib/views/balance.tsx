import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, AppState, AppStateStatus } from 'react-native';

import CurrencyHelpers from '../helpers/currency';

import { Budget, Transaction } from '../models';
import Colours from '../colours';

import BudgetApi from '../data/budget';

import Progress from '../components/progress';
import Transactions from '../components/transactions';


interface IBalanceViewProps {
    style?: any;
    appState: AppStateStatus;
    onError: (message: string) => void;
}

interface IBalanceViewstate {
    budget: Budget | null;
    refreshing: boolean;
}

export default class BalanceView extends React.Component<IBalanceViewProps, IBalanceViewstate> {
    state = {
        budget: null,
        loading: true,
        refreshing: false,
    }

    async componentDidMount() {
        await this.getBudget();
    }
    
    async componentDidUpdate(prev: IBalanceViewProps) {
        if (prev.appState.match(/background|inactive/) && this.props.appState === 'active')
            await this.getBudget();
    }

    render() {
        const budget = this.state.budget as Budget | null;
        if (budget == null)
            return <View style={styles.loading} />;

        const amount = budget.weeklyAmount - budget.transactions.filter(b => !b.ignored).map(b => b.amount).reduce((sum, amount) => sum + amount, 0);
        return <ScrollView
            style={[styles.container, this.props.style]}
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
        </ScrollView>;
    }

    private async getBudget() {
        try {
            this.setState({
                budget: await BudgetApi.get()
            });
        } catch (e) {
            console.log(e);
            this.props.onError('An error has occurred while retreiving this week\'s budget. Please try again later.');
        }
    }

    private async onTransactionChanged(transaction: Transaction) {
        try {
            transaction.ignored = !transaction.ignored;
            this.setState({ budget: this.state.budget });
            await BudgetApi.updateTransaction(transaction);
        } catch (e) {
            console.log(e);
            this.props.onError('An error has occurred while updating the transaction. Please try again later.');

            transaction.ignored = !transaction.ignored;
            this.setState({
                budget: this.state.budget
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.background.default
    },

    loading: {
        backgroundColor: Colours.background.default,
        flex: 1
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