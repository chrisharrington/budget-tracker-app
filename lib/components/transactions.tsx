import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import { Tag, Transaction } from '../models';
import Colours from '../colours';
import Config from '../config';

import TransactionDetailsModal from './transaction-details-modal';
import TransactionSplitModal from './transaction-split-modal';

dayjs.extend(timezone);


interface TransactionProps {
    transactions: Transaction[];
    tags: Tag[];
    onChange: (transaction: Transaction) => void;
    onError: (message: string) => void;
    onRefresh: () => void;
}

interface TransactionsState {
    detailsTransaction: Transaction | null;
    splitTransaction: Transaction | null;
}

export default class Transactions extends React.Component<TransactionProps, TransactionsState> {
    state = {
        detailsTransaction: null,
        splitTransaction: null
    }

    render() {
        const transactions = this.props.transactions;
        return <View style={styles.container}>
            {!transactions.length && <Text style={styles.noTransactionsText}>No transactions</Text>}
            {(transactions || [])
                .map((transaction: Transaction, index: number) => this.renderTransaction(transaction, index))}

            <TransactionDetailsModal
                transaction={this.state.detailsTransaction}
                tags={this.props.tags}
                onClose={() => this.setState({ detailsTransaction: null })}
                onChange={(transaction: Transaction) => this.props.onChange(transaction)}
            />

            <TransactionSplitModal
                transaction={this.state.splitTransaction}
                onClose={() => this.setState({ splitTransaction: null })}
                onError={(message: string) => this.props.onError(message)}
                onSplit={() => this.onTransactionSplit()}
            />
        </View>;
    }

    private renderTransaction(transaction: Transaction, index: number) {
        return <TouchableOpacity
            onPress={() => !transaction.balance && this.onPress(transaction)}
            onLongPress={() => !transaction.balance && this.onLongPress(transaction)}
            activeOpacity={0.8}
            key={transaction.description + index}
        >
            <View style={[styles.transaction, transaction.ignored || transaction.balance || transaction.tags.some(t => t.ignore) ? styles.transactionIgnored : null]}>
                <View style={[styles.transactionOwner, { backgroundColor: transaction.owner === 'Chris' ? Colours.chris : Colours.sarah }]}></View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDate}>{dayjs(transaction.date).format('MM/DD')}</Text>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    <Text style={styles.transactionAmount}>{`$${transaction.amount.toFixed(2)}`}</Text>
                </View>
            </View>
        </TouchableOpacity>;
    }

    private onPress(transaction: Transaction) {
        if (this.canEdit(transaction))
            this.setState({ detailsTransaction: transaction });
        else
            this.props.onError('Unable to edit transaction because it occurred too long ago.');
    }

    private onLongPress(transaction: Transaction) {
        if (this.canEdit(transaction)) {
            Vibration.vibrate(10);
            this.setState({ splitTransaction: transaction });
        } else
            this.props.onError('Unable to edit transaction because it occurred too long ago.');
    }

    private onTransactionSplit() {
        this.setState({ splitTransaction: null });
        this.props.onRefresh();
    }

    private canEdit(transaction: Transaction) : boolean {
        const startOfPreviousWeek = dayjs().tz(Config.Timezone).startOf('week').add(1, 'day').subtract(1, 'week');
        return dayjs(transaction.date).tz(Config.Timezone).isAfter(startOfPreviousWeek);
    }
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