import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';

import { Budget, Transaction } from '../models';
import Colours from '../colours';

interface ITransactionsProps {
    budget: Budget;
    onTransactionToggled: (transaction: Transaction) => void;
}

export default class Transactions extends React.Component<ITransactionsProps> {
    render() {
        return <View style={styles.container}>
            {this.props.budget.transactions
                .sort((first: Transaction, second: Transaction) => dayjs(first.date).isBefore(second.date) ? 1 : -1)
                .map((transaction: Transaction, index: number) => <TransactionView
                    item={transaction}
                    key={transaction.description + index}
                    onToggle={() => this.onTransactionToggled(transaction)}
                />)}
        </View>;
    }

    private onTransactionToggled(transaction: Transaction) {
        this.props.onTransactionToggled(transaction);
    }
}

const TransactionView = ({ item, onToggle } : { item: Transaction, onToggle: () => void }) => (
    <TouchableOpacity
        style={[styles.transaction, item.ignored ? styles.transactionIgnored : null]}
        onPress={() => onToggle()}
        activeOpacity={0.5}
    >
        <View style={[styles.transactionOwner, { backgroundColor: item.owner === 'Chris' ? Colours.chris : Colours.sarah }]}></View>
        <Text style={styles.transactionDate}>{dayjs(item.date).format('MM/DD')}</Text>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionAmount}>{`$${item.amount}`}</Text>
    </TouchableOpacity>
)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        marginTop: 10
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
        backgroundColor: 'transparent'
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
        fontSize: 14,
        fontFamily: 'Lato'
    },

    transactionDescription: {
        flex: 2,
        color: Colours.text.default,
        fontSize: 14,
        fontFamily: 'Lato'
    },

    transactionAmount: {
        flex: 1,
        color: Colours.text.default,
        fontSize: 14,
        textAlign: 'right',
        fontFamily: 'Lato'
    }
});