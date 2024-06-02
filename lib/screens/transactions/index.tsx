import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, RefreshControl, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar as ReactStatusBar, StyleSheet, AppState, AppStateStatus } from 'react-native';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';
import Colours from '@lib/colours';
import { Progress } from '@lib/components/progress';
import { Transactions } from '@lib/components/transactions';
import { Budget, OneTime, Tag, Transaction } from '@lib/models';
import BudgetApi from '@lib/data/budget';
import TagApi from '@lib/data/tag';
import OneTimeApi from '@lib/data/one-time';
import { StateContext } from '@lib/context';
import { Loader } from '@lib/components/loader';
import { Error } from '@lib/components/error';
import styles from './styles';

type Props = {
}

export const TransactionsScreen = ({ }: Props) => {
    const [budget, setBudget] = useState<Budget | null>(),
        [transactions, setTransactions] = useState<Transaction[]>([]),
        [tags, setTags] = useState<Tag[]>([]),
        [oneTime, setOneTime] = useState<OneTime | null>(null),
        [error, setError] = useState<Error | null>(null),
        [_, setAppState] = useState<AppStateStatus>(AppState.currentState),
        { toast } = useContext(StateContext),

        dateRef = useRef<Date>(dayjs().toDate());

    const amount = useMemo(() => (budget?.weeklyAmount || 0) - transactions.filter(transaction => !transaction.ignored && (transaction.tags || []).every(tag => !tag.ignore))
        .map(b => b.amount)
        .reduce((sum, amount) => sum + amount, 0), [budget, transactions]);

    const balance = budget?.balance || 0;

    useEffect(() => {
        (async () => {
            try {
                await Promise.all([
                    getBudget(),
                    getTags(),
                    getOneTimeBalance()
                ]);

                AppState.addEventListener('change', async (nextState: AppStateStatus) => {
                    setAppState(prevAppState => {
                        if (prevAppState.match(/background|inactive/) && nextState === 'active')
                            getBudget();

                        return AppState.currentState;
                    });
                });
            } catch (e) {
                console.error(e);
                setError(e as Error);
            }
        })();
    }, []);

    if (!budget || !oneTime || !tags)
        return <Loader />;

    if (error)
        return <Error error={error} />;

    return <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
    >
        <View style={styles.additionalDataContainer}>
            <Text style={styles.additionalDataText}>One-time balance:</Text>
            <Text style={styles.additionalDataValue}>
                {oneTime?.balance === undefined ?
                    'Not available' :
                    (`${oneTime.balance < 0 ? '-' : ''}$` + Math.abs(oneTime.balance).toFixed(2))}
            </Text>
        </View>

        <View style={styles.separator}></View>

        <View style={styles.dateMenu}>
            <TouchableOpacity style={styles.previousDateButton} onPress={async () => await onPreviousWeek()}>
                <Ionicons name='caret-back-outline' size={20} color={Colours.text.default} style={{ marginTop: 6, marginLeft: 10 }} />
            </TouchableOpacity>
            <Text style={styles.currentDate}>{dayjs(budget?.date).format('MM/DD/YYYY')}</Text>
            <TouchableOpacity style={styles.nextDateButton} onPress={async () => await onNextWeek()}>
                <Ionicons name='caret-forward-outline' size={20} color={Colours.text.default} style={{ textAlign: 'right', marginTop: 6, marginRight: 10 }} />
            </TouchableOpacity>
        </View>

        <Progress
            budget={budget}
            amount={amount + balance}
        />

        <View style={styles.additionalDataContainer}>
            <Text style={styles.additionalDataText}>Last week's balance:</Text>
            <Text style={styles.additionalDataValue}>
                {budget.balance === undefined ?
                    'Not available' :
                    (balance < 0 ? '-' : '') + '$' + Math.abs(balance).toFixed(2)}
            </Text>
        </View>

        <View style={styles.separator}></View>

        <Transactions
            transactions={transactions.filter(t => !t.balance)}
            tags={tags}
            onChange={(transaction: Transaction) => onTransactionChanged(transaction)}
            onError={(message: string) => toast.current?.error(message)}
            onRefresh={() => getBudget(budget?.date)}
        />
    </ScrollView>;

    async function getBudget(date?: Date) {
        if (!date)
            date = dateRef.current;

        try {
            const { transactions, budget } = await BudgetApi.get(date);
            setBudget(budget);
            setTransactions(transactions.sort((first, second) => dayjs(second.date).valueOf() - dayjs(first.date).valueOf()));
            dateRef.current = budget.date;
        } catch (e) {
            console.error(e);
            setError(e as Error);
        }
    }

    async function getTags() {
        try {
            const tags = await TagApi.get();
            setTags(tags);
        } catch (e) {
            console.error(e);
            setError(e as Error);
        }
    }

    async function getOneTimeBalance() {
        try {
            const oneTime = await OneTimeApi.get();
            setOneTime(oneTime);
        } catch (e) {
            console.error(e);
            setError(e as Error);
        }
    }

    async function onPreviousWeek() {
        if (!budget)
            return;

        await getBudget(dayjs(budget.date).subtract(1, 'week').toDate());
    }

    async function onNextWeek() {
        if (!budget)
            return;

        const date = dayjs(budget.date).add(1, 'week');
        if (date.isAfter(dayjs()))
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
            await getOneTimeBalance();
        } catch (e) {
            console.error(e);
            toast.current?.error('An error has occurred while updating the transaction. Please try again later.');
            setBudget(budget);
        }
    }
}