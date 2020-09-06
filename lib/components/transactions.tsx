import * as React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import dayjs from 'dayjs';

import { Budget, Transaction } from '../models';
import Colours from '../colours';

interface ITransactionsProps {
    budget: Budget;
    onTransactionToggled: (transaction: Transaction) => void;
}

export default class Transactions extends React.Component<ITransactionsProps> {
    render() {
        const transactions = this.props.budget.transactions;
        return <View style={styles.container}>
            {!transactions.length && <Text style={styles.noTransactionsText}>No transactions</Text>}
            {(transactions || [])
                .sort((first: Transaction, second: Transaction) => this.sort(first, second))
                .map((transaction: Transaction, index: number) => <TransactionView
                    transaction={transaction}
                    key={transaction.description + index}
                    onToggle={() => this.onTransactionToggled(transaction)}
                />)}
        </View>;
    }

    private onTransactionToggled(transaction: Transaction) {
        this.props.onTransactionToggled(transaction);
    }

    private sort(first: Transaction, second: Transaction) : number {
        const firstDate = dayjs(first.date),
            secondDate = dayjs(second.date);

        if (firstDate.isSame(secondDate))
            return first._id.localeCompare(second._id);

        return dayjs(first.date).isBefore(second.date) ? 1 : -1
    }
}

class TransactionView extends React.Component<{ transaction: Transaction, onToggle: () => void }> {
    render() {
        const transaction = this.props.transaction;
        return <TouchableWithoutFeedback
            onPress={() => this.props.onToggle()}
        >
            <View style={[styles.transaction, transaction.ignored ? styles.transactionIgnored : null]}>
                <View style={[styles.transactionOwner, { backgroundColor: transaction.owner === 'Chris' ? Colours.chris : Colours.sarah }]}></View>
                <Text style={styles.transactionDate}>{dayjs(transaction.date).format('MM/DD')}</Text>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionAmount}>{`$${transaction.amount.toFixed(2)}`}</Text>
            </View>
        </TouchableWithoutFeedback>;
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