import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import dayjs from 'dayjs';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList, Transaction as TransactionModel } from '@lib/models';
import { getAllowanceTransactions } from '@lib/data/allowances';
import { WrapResult } from '@lib/data/wrap';
import { LoaderBoundary } from '@lib/components/loaderBoundary';
import Colours from '@lib/colours';
import { styles } from './style';

type Props = BottomTabScreenProps<TabParamList, 'Quinn' | 'Zoe'>;

const quinnAllowances = getAllowanceTransactions('quinn'),
    zoeAllowances = getAllowanceTransactions('zoe');

export const QuinnAllowancesScreen = (props : Props) => <AllowancesScreen {...props} owner='quinn' resource={quinnAllowances} />;
export const ZoeAllowancesScreen = (props : Props) => <AllowancesScreen {...props} owner='zoe' resource={zoeAllowances} />;

const AllowancesScreen = ({ owner, resource } : Props & { owner: string, resource: WrapResult<TransactionModel[]> }) => {
    return <ScrollView style={styles.container}>
        <LoaderBoundary
            loadingFallback={<ActivityIndicator size={36} color={Colours.text.success} />}
            errorFallback={<Text style={styles.error}>Unable to load transaction list</Text>}
        >
            <Transactions resource={resource} owner={owner} />
        </LoaderBoundary>
    </ScrollView>;
}

const Transactions = ({ resource, owner } : { resource: WrapResult<TransactionModel[]>, owner: string }) => {
    const transactions = resource.read(),
        total = useMemo(() => transactions.reduce((total, transaction) => total + (transaction.amount * (transaction.isAllowancePayment ? 1 : -1)), 0), [transactions]);

    return <View>
        <View style={styles.header}>
            <Text style={styles.headerOwner}>{`${owner[0].toUpperCase() + owner.slice(1)}'s Allowance`}</Text>
            <Text style={styles.headerAmount}>{`$${total.toFixed(2)}`}</Text>
        </View>

        {transactions.map((transaction, index) => <Transaction key={index} transaction={transaction} />)}
    </View>;
}

const Transaction = ({ transaction } : { transaction: TransactionModel }) => (
    <View style={styles.transaction}>
        <Text style={styles.transactionDate}>{dayjs(transaction.date).format('MM/DD')}</Text>
        <Text style={styles.transactionDescription}>{transaction.description}</Text>
        <Text style={[styles.transactionAmount, { color: transaction.isAllowancePayment ? Colours.text.positive : Colours.text.negative}]}>{`${transaction.isAllowancePayment ? '' : '-'}$${transaction.amount.toFixed(2)}`}</Text>
    </View>
);