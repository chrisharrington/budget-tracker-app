import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';

import { Transaction } from '../models';
import Colours from '../colours';
import BudgetApi from '../data/budget';

import Modal from './modal';


interface TransactionSplitModalProps {
    transaction: Transaction | null;
    onClose: () => void;
    onError: (message: string) => void;
    onSplit: () => void;
}

interface TransactionSplitModalState {
    transaction: Transaction | null;
    firstAmount: number;
    secondAmount: string;
}

export const TransactionSplitModal = (props: TransactionSplitModalProps) => {
    const [transaction, setTransaction] = React.useState<Transaction | null>(null),
        [firstAmount, setFirstAmount] = React.useState(0),
        [secondAmount, setSecondAmount] = React.useState('');

    React.useEffect(() => {
        if (props.transaction && (!transaction || transaction.amount !== props.transaction.amount)) {
            setTransaction(props.transaction);
            setFirstAmount(props.transaction.amount);
            setSecondAmount('');
        }
    }, [props.transaction]);

    const onSecondAmountChanged = (amount: string) => {
        setSecondAmount(amount);
    }

    const onFiftyPercent = () => {
        if (!transaction)
            return;

        setSecondAmount((transaction.amount / 2).toFixed(2));
    }

    const onSave = async () => {
        if (!transaction)
            return;

        try {
            const secondAmountValue = parseFloat(secondAmount);
            if (isNaN(secondAmountValue)) {
                props.onError('The amount entered is invalid.');
                return;
            }

            await BudgetApi.splitTransaction(transaction, secondAmountValue);
            props.onSplit();
        } catch (e) {
            console.error(e);
            props.onError('An error has occurred while splitting this transaction. Please try again later.');
        }
    }

    const formatCurrency = (value: number) => {
        if (value === 0)
            return '$0.00';

        const decimal = Math.floor((value - Math.floor(value)) * 100);
        return `$${Math.floor(value)}.${decimal.toString().padStart(2, '0')}`;
    }

    const getFirstAmount = () => {
        const parsed = parseFloat(secondAmount);
        return firstAmount - (isNaN(parsed) ? 0 : parsed);
    }

    const firstAmountValue = getFirstAmount();

    return <Modal
        visible={!!props.transaction}
        onClose={() => props.onClose()}
        onSave={() => onSave()}
        saveButtonText='Split'
        saveButtonDisabled={firstAmountValue < 0}
    >
        {transaction && <>
            <Text style={styles.description}>{transaction.description}</Text>
            <Text style={styles.date}>{`${dayjs(transaction.date).format('MMMM D, YYYY')} at ${dayjs(transaction.date).format('h:mm:ss a')}`}</Text>
            <View style={styles.amountsContainer}>
                <Text style={styles.amountLabel}>First Transaction</Text>
                <Text style={[styles.amountValue, firstAmountValue < 0 ? styles.amountValueError : undefined]}>{formatCurrency(firstAmountValue)}</Text>
            </View>
            <View style={styles.amountsContainer}>
                <Text style={styles.amountLabel}>Second Transaction</Text>

                <View style={styles.amountsInputContainer}>
                    <TextInput
                        style={styles.amountInput}
                        placeholder='$12.34'
                        value={secondAmount.toString()}
                        onChangeText={value => onSecondAmountChanged(value)}
                        autoFocus
                        keyboardType='decimal-pad'
                    />

                    <TouchableOpacity style={styles.amountInputFiftyPercent} onPress={() => onFiftyPercent()}>
                        <Text style={styles.amountInputFiftyPercentText}>50%</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.amountsContainer, styles.totalAmounts]}>
                <Text style={styles.amountLabel}>Total</Text>
                <Text style={styles.amountValue}>{formatCurrency(transaction.amount)}</Text>
            </View>
        </>}
    </Modal>;
}

class OldTransactionSplitModal extends React.Component<TransactionSplitModalProps, TransactionSplitModalState> {
    state = {
        transaction: null as Transaction | null,
        firstAmount: 0,
        secondAmount: ''
    }

    componentDidUpdate(prev: TransactionSplitModalProps) {
        const oldTransaction = prev.transaction,
            newTransaction = this.props.transaction;

        if (newTransaction && (!oldTransaction || oldTransaction.amount !== newTransaction.amount))
            this.setState({
                transaction: newTransaction,
                firstAmount: newTransaction.amount,
                secondAmount: ''
            });
    }

    render() {
        const transaction = this.state.transaction as Transaction | null,
            firstAmount = this.getFirstAmount();

        return <Modal
            visible={!!this.props.transaction}
            onClose={() => this.props.onClose()}
            onSave={() => this.onSave()}
            saveButtonText='Split'
            saveButtonDisabled={firstAmount < 0}
        >
            {transaction && <>
                <Text style={styles.description}>{transaction.description}</Text>
                <Text style={styles.date}>{`${dayjs(transaction.date).format('MMMM D, YYYY')} at ${dayjs(transaction.date).format('h:mm:ss a')}`}</Text>
                <View style={styles.amountsContainer}>
                    <Text style={styles.amountLabel}>First Transaction</Text>
                    <Text style={[styles.amountValue, firstAmount < 0 ? styles.amountValueError : undefined]}>{this.formatCurrency(firstAmount)}</Text>
                </View>
                <View style={styles.amountsContainer}>
                    <Text style={styles.amountLabel}>Second Transaction</Text>

                    <View style={styles.amountsInputContainer}>
                        <TextInput
                            style={styles.amountInput}
                            placeholder='$12.34'
                            value={this.state.secondAmount.toString()}
                            onChangeText={value => this.onSecondAmountChanged(value)}
                            autoFocus
                            keyboardType='decimal-pad'
                        />

                        <TouchableOpacity style={styles.amountInputFiftyPercent} onPress={() => this.onFiftyPercent()}>
                            <Text style={styles.amountInputFiftyPercentText}>50%</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.amountsContainer, styles.totalAmounts]}>
                    <Text style={styles.amountLabel}>Total</Text>
                    <Text style={styles.amountValue}>{this.formatCurrency(transaction.amount)}</Text>
                </View>
            </>}
        </Modal>;
    }

    private onSecondAmountChanged(amount: string) {
        this.setState({
            secondAmount: amount
        });
    }

    private onFiftyPercent() {
        const transaction = this.state.transaction;
        if (!transaction)
            return;

        this.setState({
            secondAmount: (transaction.amount / 2).toFixed(2)
        });
    }

    private async onSave() {
        const transaction = this.state.transaction;
        if (!transaction)
            return;

        try {
            const secondAmount = parseFloat(this.state.secondAmount);
            if (isNaN(secondAmount)) {
                this.props.onError('The amount entered is invalid.');
                return;
            }

            await BudgetApi.splitTransaction(transaction, secondAmount);
            this.props.onSplit();
        } catch (e) {
            console.error(e);
            this.props.onError('An error has occurred while splitting this transaction. Please try again later.');
        }
    }

    private formatCurrency(value: number) {
        if (value === 0)
            return '$0.00';

        const decimal = Math.floor((value - Math.floor(value)) * 100);
        return `$${Math.floor(value)}.${decimal.toString().padStart(2, '0')}`;
    }

    private getFirstAmount() {
        const parsed = parseFloat(this.state.secondAmount);
        return this.state.firstAmount - (isNaN(parsed) ? 0 : parsed);
    }
}


const styles = StyleSheet.create({
    description: {
        fontFamily: 'Lato',
        fontSize: 20,
        color: Colours.text.default,
        textTransform: 'uppercase'
    },

    date: {
        fontFamily: 'Lato',
        fontSize: 14,
        color: Colours.text.lowlight,
        marginTop: 10
    },

    amountsContainer: {
        marginTop: 15
    },

    totalAmounts: {
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: Colours.border.light,
        marginBottom: 15
    },

    amountLabel: {
        width: '100%',
        textTransform: 'uppercase',
        fontSize: 12,
        fontWeight: 'bold',
        color: Colours.text.lowlight
    },

    amountValue: {
        width: '100%',
        color: Colours.text.default,
        fontSize: 16,
        marginTop: 6,
        padding: 10,
        borderRadius: 3,
        backgroundColor: Colours.background.light
    },

    amountValueError: {
        backgroundColor: Colours.background.error
    },

    amountsInputContainer: {
        width: '100%',
        flexDirection: 'row',
        gap: 15
    },

    amountInput: {
        flex: 3,
        color: 'black',
        fontSize: 16,
        marginTop: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderRadius: 3
    },

    amountInputFiftyPercent: {
        flex: 1,
        alignItems: 'center',
        marginTop: 6,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        borderRadius: 3,
        height: 46,
        backgroundColor: Colours.button.positive
    },

    amountInputFiftyPercentText: {
        color: Colours.text.default,
        height: 46,
        textAlignVertical: 'center'
    }
});