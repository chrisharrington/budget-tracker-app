import * as React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';

import { Transaction } from '../models';
import Colours from '../colours';

interface ITransactionModalProps {
    transaction: Transaction | null;
    onClose: () => void;
    onChange: (transaction: Transaction) => void;
}

interface ITransactionModalState {
    transaction: Transaction | null;
    amount: string;
    error: boolean;
}

export default class TransactionModal extends React.Component<ITransactionModalProps, ITransactionModalState> {
    state = {
        amount: '',
        transaction: null as Transaction | null,
        error: false
    }

    componentDidUpdate(prev: ITransactionModalProps) {
        const oldTransaction = prev.transaction,
            newTransaction = this.props.transaction;

        if (newTransaction && (!oldTransaction || oldTransaction.amount !== newTransaction.amount))
            this.setState({
                amount: newTransaction.amount.toString(),
                error: false,
                transaction: newTransaction
            });
    }

    render() {
        const transaction = this.state.transaction as Transaction | null;
        return <Modal
            isVisible={!!this.props.transaction}
            backdropOpacity={0.4}
            hideModalContentWhileAnimating={true}
            backdropTransitionOutTiming={0}
            style={styles.modal}
        >
            <View style={styles.inner}>
                {transaction && <>
                    <Text style={styles.description}>{transaction.description}</Text>
                    <Text style={styles.date}>{`${dayjs(transaction.date).format('MMMM D, YYYY')} at ${dayjs(transaction.date).format('h:mm:ss a')}`}</Text>
                    <TextInput style={[styles.amount, this.state.error ? styles.amountError: null]} onChangeText={(amount: string) => this.setState({ amount })}>{this.state.amount}</TextInput>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => this.props.onClose()}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => this.onSave()}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </>}
            </View>
        </Modal>;
    }

    private onSave() {
        try {
            const float = parseFloat(this.state.amount);
            if (this.state.amount === '' || isNaN(float))
                this.setState({ error: true });
            else {
                this.setState({ error: false });
                
                const transaction = this.state.transaction;
                if (transaction) {
                    transaction.amount = float;
                    this.props.onChange(transaction);
                    this.props.onClose();
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}


const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-start',
        paddingTop: 50
    },

    inner: {
        backgroundColor: Colours.background.default,
        padding: 25,
        borderRadius: 5
    },

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

    amount: {
        fontSize: 14,
        color: Colours.text.default,
        marginTop: 10,
        borderRadius: 3,
        width: '100%',
        backgroundColor: Colours.background.light,
        paddingTop: 4,
        paddingRight: 9,
        paddingBottom: 4,
        paddingLeft: 9,
        borderWidth: 1,
        borderColor: Colours.background.light
    },

    amountError: {
        borderColor: Colours.background.error
    },

    buttonContainer: {
        flexDirection: 'row'
    },

    button: {
        alignItems: 'center',
        marginTop: 15,
        paddingTop: 10,
        paddingBottom: 10,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        borderRadius: 3
    },

    buttonText: {
        color: Colours.text.default
    },

    cancelButton: {
        flex: 1,
        backgroundColor: Colours.button.negative,
        marginRight: 5
    },

    saveButton: {
        flex: 2,
        backgroundColor: Colours.button.positive,
        marginLeft: 5
    }
});