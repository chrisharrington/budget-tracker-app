import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import dayjs from 'dayjs';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { TabParamList, Transaction as TransactionModel } from '@lib/models';
import { getAllowanceTransactions } from '@lib/data/allowances';
import Colours from '@lib/colours';
import styles from './styles';
import { Loader } from '@lib/components/loader';
import { Error } from '@lib/components/error';

type Props = BottomTabScreenProps<TabParamList, 'Quinn' | 'Zoe'>;

export const QuinnAllowancesScreen = (props: Props) => <AllowancesScreen {...props} owner='quinn' />;
export const ZoeAllowancesScreen = (props: Props) => <AllowancesScreen {...props} owner='zoe' />;

const AllowancesScreen = ({ owner }: Props & { owner: string }) => {
    const [transactions, setTransactions] = useState<TransactionModel[]>([]),
        [loading, setLoading] = useState<boolean>(true),
        [error, setError] = useState<Error | null>(null),
        total = useMemo(() => transactions.reduce((total, transaction) => total + (transaction.amount * (transaction.isAllowancePayment ? 1 : -1)), 0), [transactions]);

    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                setError(null);
                setLoading(true);
                setTransactions(await getAllowanceTransactions(owner));
            } catch (e) {
                console.error(e);
                setError(e as Error);
            } finally {
                setLoading(false);
            }
        })();
    }, [owner]));

    if (loading)
        return <Loader />;

    if (error)
        return <Error error={error} />;

    return <ScrollView style={styles.container}>
        <View>
            <View style={styles.header}>
                <Text style={styles.headerOwner}>{`${owner[0].toUpperCase() + owner.slice(1)}'s Allowance`}</Text>
                <Text style={styles.headerAmount}>{`$${total.toFixed(2)}`}</Text>
            </View>

            {transactions.map((transaction, index) => <Transaction key={index} transaction={transaction} />)}
        </View>
    </ScrollView>;
}

const Transaction = ({ transaction }: { transaction: TransactionModel }) => (
    <View style={styles.transaction}>
        <Text style={styles.transactionDate}>{dayjs(transaction.date).format('MM/DD')}</Text>
        <Text style={styles.transactionDescription}>{transaction.description}</Text>
        <Text style={[styles.transactionAmount, { color: transaction.isAllowancePayment ? Colours.text.positive : Colours.text.negative }]}>{`${transaction.isAllowancePayment ? '' : '-'}$${transaction.amount.toFixed(2)}`}</Text>
    </View>
);