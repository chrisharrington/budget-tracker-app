import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import dayjs from 'dayjs';

import { Budget, Transaction } from '../models';
import Colours from '../colours';

import TransactionModal from './transaction-modal';

interface ITransactionsProps {
    budget: Budget;
    onChange: (transaction: Transaction) => void;
    onSelect: (transaction: Transaction | null) => void;
    onError: (message: string) => void;
}

interface ITransactionsState {
    transaction: Transaction | null;
}

export default class Transactions extends React.Component<ITransactionsProps, ITransactionsState> {
    state = {
        transaction: null
    }

    render() {
        const transactions = this.props.budget.transactions;
        return <View style={styles.container}>
            {!transactions.length && <Text style={styles.noTransactionsText}>No transactions</Text>}
            {(transactions || [])
                .sort((first: Transaction, second: Transaction) => this.sort(first, second))
                .map((transaction: Transaction, index: number) => <TransactionView
                    transaction={transaction}
                    key={transaction.description + index}
                    onToggle={() => this.onToggle(transaction)}
                    onLongPress={() => this.onTransactionSelected(transaction)}
                />)}

            <TransactionModal
                transaction={this.state.transaction}
                onClose={() => this.setState({ transaction: null })}
                onChange={(transaction: Transaction) => this.props.onChange(transaction)}
            />
        </View>;
    }

    private onToggle(transaction: Transaction) {
        transaction.ignored = !transaction.ignored;
        this.props.onChange(transaction);
    }

    private sort(first: Transaction, second: Transaction) : number {
        const firstDate = dayjs(first.date),
            secondDate = dayjs(second.date);

        if (firstDate.isSame(secondDate))
            return first._id.localeCompare(second._id);

        return dayjs(first.date).isBefore(second.date) ? 1 : -1
    }

    private onTransactionSelected(transaction: Transaction) {
        Vibration.vibrate(10);
        this.setState({ transaction });
    }
}

class TransactionView extends React.Component<{ transaction: Transaction, onToggle: () => void, onLongPress: () => void }> {
    render() {
        const transaction = this.props.transaction;
        return <TouchableOpacity
            onPress={() => this.props.onToggle()}
            onLongPress={() => this.props.onLongPress()}
            activeOpacity={0.8}
        >
            <View style={[styles.transaction, transaction.ignored ? styles.transactionIgnored : null]}>
                <View style={[styles.transactionOwner, { backgroundColor: transaction.owner === 'Chris' ? Colours.chris : Colours.sarah }]}></View>
                <Text style={styles.transactionDate}>{dayjs(transaction.date).format('MM/DD')}</Text>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionAmount}>{`$${transaction.amount.toFixed(2)}`}</Text>
            </View>
        </TouchableOpacity>;
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25
    },

    transaction: {
        width: '100%',
        marginTop: 15,
        padding: 14,
        backgroundColor: Colours.background.light,
        borderWidth: 1,
        borderColor: Colours.background.light,
        flexDirection: 'row',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3
    },

    transactionIgnored: {
        opacity: 0.3
    },
    
    transactionOwner: {
        position: 'absolute',
        width: 16,
        height: 16,
        transform: [{ rotate: '45deg' }],
        left: -8,
        top: -8
    },

    transactionDate: {
        flex: 1,
        color: Colours.text.lowlight,
        fontSize: 12,
        fontFamily: 'Lato'
    },

    transactionDescription: {
        flex: 2,
        color: Colours.text.default,
        fontSize: 12,
        fontFamily: 'Lato'
    },

    transactionAmount: {
        flex: 1,
        color: Colours.text.default,
        fontSize: 12,
        textAlign: 'right',
        fontFamily: 'Lato'
    },

    noTransactionsText: {
        width: '100%',
        textAlign: 'center',
        color: Colours.text.lowlight,
        fontSize: 12,
        marginTop: 25
    }
});