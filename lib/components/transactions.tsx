import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { Tag, Transaction } from '../models';
import Colours from '../colours';
import { TransactionDetailsModal } from './transaction-details-modal';
import { TransactionSplitModal } from './transaction-split-modal';

import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

dayjs.extend(timezone);

type Props = {
    transactions: Transaction[];
    tags: Tag[];
    onChange: (transaction: Transaction) => void;
    onError: (message: string) => void;
    onRefresh: () => void;
}

export const Transactions = (props: Props) => {
    const [detailsTransaction, setDetailsTransaction] = React.useState<Transaction | null>(null);
    const [splitTransaction, setSplitTransaction] = React.useState<Transaction | null>(null);

    const renderTransaction = (transaction: Transaction, index: number) => {
        return <TouchableOpacity
            onPress={() => !transaction.balance && onPress(transaction)}
            onLongPress={() => !transaction.balance && onLongPress(transaction)}
            activeOpacity={0.8}
            key={transaction.description + index}
        >
            <View style={[styles.transaction, transaction.ignored || transaction.balance || (transaction.tags || []).some(t => t.ignore) ? styles.transactionIgnored : null]}>
                <View style={[styles.transactionOwner, { backgroundColor: transaction.owner === 'Chris' ? Colours.chris : Colours.sarah }]}></View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDate}>{dayjs(transaction.date).format('MM/DD')}</Text>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    <Text style={styles.transactionAmount}>{`$${transaction.amount.toFixed(2)}`}</Text>
                </View>
            </View>
        </TouchableOpacity>;
    }

    const onPress = (transaction: Transaction) => {
        if (canEdit(transaction))
            setDetailsTransaction(transaction);
        else
            props.onError('Unable to edit transaction because it occurred too long ago.');
    }

    const onLongPress = (transaction: Transaction) => {
        if (canEdit(transaction)) {
            Vibration.vibrate(10);
            setSplitTransaction(transaction);
        } else
            props.onError('Unable to edit transaction because it occurred too long ago.');
    }

    const onTransactionSplit = () => {
        setSplitTransaction(null);
        props.onRefresh();
    }

    const canEdit = (transaction: Transaction) : boolean => {
        // const startOfPreviousWeek = dayjs.utc().startOf('week').add(1, 'day').subtract(1, 'week');
        let startOfPreviousWeek = dayjs().startOf('day').subtract(1, 'week');
        while (startOfPreviousWeek.day() !== 1)
            startOfPreviousWeek = startOfPreviousWeek.subtract(1, 'day');
        return dayjs(transaction.date).isAfter(startOfPreviousWeek);
    }

    const transactions = props.transactions;
    return <View style={styles.container}>
        {!transactions.length && <Text style={styles.noTransactionsText}>No transactions</Text>}
        {(transactions || [])
            .map((transaction: Transaction, index: number) => renderTransaction(transaction, index))}

        <TransactionDetailsModal
            transaction={detailsTransaction}
            tags={props.tags}
            onClose={() => setDetailsTransaction(null)}
            onChange={(transaction: Transaction) => props.onChange(transaction)}
        />

        <TransactionSplitModal
            transaction={splitTransaction}
            onClose={() => setSplitTransaction(null)}
            onError={(message: string) => props.onError(message)}
            onSplit={onTransactionSplit}
        />
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        paddingTop: 0
    },

    transaction: {
        width: '100%',
        marginTop: 15,
        padding: 14,
        backgroundColor: Colours.background.light,
        borderWidth: 1,
        borderColor: Colours.background.light,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3
    },

    transactionIgnored: {
        opacity: 0.3
    },

    transactionDetails: {
        flex: 1,
        flexDirection: 'row'
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

    tags: {
        flex: 1,
        width: '100%',
        marginTop: 6,
        borderTopColor: Colours.border.light,
        paddingTop: 6,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

    tagsLabel: {
        flex: 1,
        color: Colours.text.default,
        fontSize: 12
    },

    noTransactionsText: {
        width: '100%',
        textAlign: 'center',
        color: Colours.text.lowlight,
        fontSize: 12,
        marginTop: 25
    }
});