import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import BudgetApi from '../data/budget';
import TagApi from '../data/tag';

import { Budget, Tag, Transaction } from '../models';
import Colours from '../colours';

import Progress from '../components/progress';
import Transactions from '../components/transactions';

dayjs.extend(utc);


interface BalanceViewProps {
    onError: (message: string) => void;
    style?: any;
}

export default (props : BalanceViewProps) => {
    const [budget, setBudget] = useState<Budget | null>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [_, setAppState] = useState<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        getBudget();
        getTags();

        AppState.addEventListener('change', async (nextState: AppStateStatus) => {
            setAppState(prevAppState => {
                if (prevAppState.match(/background|inactive/) && nextState === 'active')
                    getBudget();

                return AppState.currentState;
            });
        });
    }, []);

    if (budget == null)
        return <View style={styles.loading} />;

    const amount = budget!.weeklyAmount - transactions
        .filter(transaction => !transaction.ignored && transaction.tags.every(tag => !tag.ignore))
        .map(b => b.amount)
        .reduce((sum, amount) => sum + amount, 0);

    const balance = transactions.find((t: Transaction) => t.balance);

    return <ScrollView
        style={[styles.container, props.style]}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => onRefresh()}/>}
    >
        <View style={styles.dateMenu}>
            <TouchableOpacity style={styles.previousDateButton} onPress={async () => await onPreviousWeek()}>
                <Ionicons name='caret-back-outline' size={20} color={Colours.text.default} style={{ marginTop: 6, marginLeft: 10 }} />
            </TouchableOpacity>
            <Text style={styles.currentDate}>{dayjs.utc(budget.date).format('MM/DD/YYYY')}</Text>
            <TouchableOpacity style={styles.nextDateButton} onPress={async () => await onNextWeek()}>
                <Ionicons name='caret-forward-outline' size={20} color={Colours.text.default} style={{ textAlign: 'right', marginTop: 6, marginRight: 10 }}  />
            </TouchableOpacity>
        </View>

        <Progress
            budget={budget}
            amount={amount}
        />

        {balance && <>
            <View style={styles.lastWeekContainer}>
                <Text style={styles.lastWeekText}>Last week's balance:</Text>
                <Text style={styles.lastWeekAmount}>{`$${(balance.amount * -1).toFixed(2)}`}</Text>
            </View>
            
            <View style={styles.separator}></View>
        </>}

        <Transactions
            transactions={transactions.filter(t => !t.balance)}
            tags={tags}
            onChange={(transaction: Transaction) => onTransactionChanged(transaction)}
            onError={(message: string) => props.onError(message)}
            onRefresh={() => getBudget(budget.date)}
        />
    </ScrollView>;

    async function getBudget(date?: Date) {
        try {
            const { transactions, budget } = await BudgetApi.get(date || new Date());
            setBudget(budget);
            setTransactions(transactions.sort((first, second) => dayjs(second.date).valueOf() - dayjs(first.date).valueOf()));
        } catch (e) {
            console.error(e);
            props.onError('An error has occurred while retrieving the budget. Please try again later.');
        }
    }

    async function getTags() {
        try {
            const tags = await TagApi.get();
            setTags(tags);
        } catch (e) {
            console.error(e);
            props.onError('An error has occurred while retrieving the list of tags. Please try again later.');
        }
    }

    async function onPreviousWeek() {
        if (!budget)
            return;

        await getBudget(dayjs.utc(budget!.date).subtract(1, 'week').toDate());
    }
 
    async function onNextWeek() {
        if (!budget)
            return;

        const date = dayjs.utc(budget!.date).add(1, 'week');
        if (date.isAfter(dayjs.utc()))
            return;

        await getBudget(date.toDate());
    }

    async function onRefresh() {
        await getBudget(budget?.date);
    }

    async function onTransactionChanged(changed: Transaction) {
        try {
            setTransactions([...transactions
                .filter(t => t._id !== changed._id), changed]
                .sort((first, second) => dayjs(second.date).valueOf() - dayjs(first.date).valueOf()));
            await BudgetApi.updateTransaction(changed);
        } catch (e) {
            console.log(e);
            props.onError('An error has occurred while updating the transaction. Please try again later.');
            setBudget(budget);
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

    dateMenu: {
        flex: 1,
        marginTop: 25,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row'
    },
    
    previousDateButton: {
        width: 50,
        textAlign: 'left',
        color: Colours.text.default,
        height: 34
    },
    
    currentDate: {
        flexGrow: 1,
        textAlign: 'center',
        color: Colours.text.default,
        fontFamily: 'Lato',
        fontSize: 28
    },
    
    nextDateButton: {
        width: 50,
        textAlign: 'right',
        color: Colours.text.default,
        height: 34,
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
    },

    separator: {
        flex: 1,
        height: 1,
        backgroundColor: Colours.background.light,
        marginTop: 20,
        marginHorizontal: 25,
        marginBottom: 5
    }
});