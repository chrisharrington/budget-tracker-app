import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';

import { Budget, BudgetItem } from '../models';
import Colours from '../colours';

interface ITransactionsProps {
    budget: Budget;
    onBudgetChanged: (budget: Budget) => void;
}

export default class Transactions extends React.Component<ITransactionsProps> {
    render() {
        return <View style={styles.container}>
            {this.props.budget.items
                .sort((first: BudgetItem, second: BudgetItem) => dayjs(first.date).isBefore(second.date) ? 1 : -1)
                .map((item: BudgetItem, index: number) => <Transaction
                    item={item}
                    key={item.description + index}
                    onToggle={() => this.onItemToggled(item)}
                />)}
        </View>;
    }

    private onItemToggled(item: BudgetItem) {
        const budget = this.props.budget;
        budget.items.forEach((i: BudgetItem) => {
            if (i._id === item._id)
                i.ignored = !i.ignored;
        });

        this.props.onBudgetChanged(budget);
    }
}

const Transaction = ({ item, onToggle } : { item: BudgetItem, onToggle: () => void }) => (
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
        backgroundColor: Colours.backgroundLight,
        borderWidth: 1,
        borderColor: Colours.backgroundLight,
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