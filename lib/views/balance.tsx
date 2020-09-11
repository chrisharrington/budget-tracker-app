import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, AppState, AppStateStatus } from 'react-native';

import CurrencyHelpers from '../helpers/currency';

import BudgetApi from '../data/budget';

import { Budget, Transaction } from '../models';
import Colours from '../colours';

import Progress from '../components/progress';
import Transactions from '../components/transactions';


interface IBalanceViewProps {
    style?: any;
    budget: Budget | null;
    refreshing: boolean;
    onError: (message: string) => void;
    onTransactionSelected: (transaction: Transaction | null) => void;
    onRefresh: () => Promise<void>;
}

export default class BalanceView extends React.Component<IBalanceViewProps> {
    state = {
        budget: null,
        loading: true
    }

    render() {
        const budget = this.props.budget as Budget | null;
        if (budget == null)
            return <View style={styles.loading} />;

        const amount = budget.weeklyAmount - budget.transactions.filter(b => !b.ignored).map(b => b.amount).reduce((sum, amount) => sum + amount, 0);
        return <ScrollView
            style={[styles.container, this.props.style]}
            refreshControl={<RefreshControl refreshing={this.props.refreshing} onRefresh={async () => await this.props.onRefresh()}/>}
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
                onChange={(transaction: Transaction) => this.onTransactionChanged(transaction)}
                onSelect={(transaction: Transaction | null) => this.props.onTransactionSelected(transaction)}
                onError={(message: string) => this.props.onError(message)}
            />
        </ScrollView>;
    }

    private async onTransactionChanged(transaction: Transaction) {
        try {
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