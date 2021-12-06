import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';

import { Tag, Transaction } from '../models';
import Colours from '../colours';

import Modal from './modal';


interface TransactionDeatilsModalProps {
    transaction: Transaction | null;
    tags: Tag[];
    onClose: () => void;
    onChange: (transaction: Transaction) => void;
}

interface TransactionDetailsModalState {
    transaction: Transaction | null;
    selectedTags: Tag[];
    error: boolean;
}

export default class TransactionDetailsModal extends React.Component<TransactionDeatilsModalProps, TransactionDetailsModalState> {
    state = {
        transaction: null as Transaction | null,
        error: false,
        selectedTags: []
    }

    componentDidUpdate(prev: TransactionDeatilsModalProps) {
        const oldTransaction = prev.transaction,
            newTransaction = this.props.transaction;

        if (newTransaction && (!oldTransaction || oldTransaction.amount !== newTransaction.amount))
            this.setState({
                error: false,
                transaction: newTransaction,
                selectedTags: newTransaction.tags
            });
    }

    render() {
        const transaction = this.state.transaction as Transaction | null;
        return <Modal
            visible={!!this.props.transaction}
            onClose={() => this.props.onClose()}
            onSave={() => this.onSave()}
        >
            {transaction && <>
                <Text style={styles.description}>{transaction.description}</Text>
                <Text style={styles.date}>{`${dayjs(transaction.date).format('MMMM D, YYYY')} at ${dayjs(transaction.date).format('h:mm:ss a')}`}</Text>
                <View>
                    {this.props.tags.map((tag: Tag) => (
                        <View style={styles.tagWrapper} key={tag._id}>
                            <TouchableOpacity activeOpacity={0.5} onPress={() => this.onToggleTag(tag)}>
                                <Text style={[styles.tag, (this.state.selectedTags || []).find((t: Tag) => t.name === tag.name) ? styles.selectedTag : undefined]}>{`#${tag.name}`}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </>}
        </Modal>;
    }

    private onToggleTag(tag: Tag) {
        const tags = this.state.selectedTags || [],
            found = tags.find((t: Tag) => t._id === tag._id);

        const selectedTags = found ?
            tags.filter((t: Tag) => t._id !== tag._id) :
            [...tags, tag].sort((first, second) => first.name.localeCompare(second.name));

        this.setState({ selectedTags });
    }

    private onSave() {
        try {
            const transaction = this.state.transaction;
            if (transaction) {
                transaction.tags = this.state.selectedTags;
                this.props.onChange(transaction);
                this.props.onClose();
            }
        } catch (e) {
            console.error(e);
        }
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
    
    tagWrapper: {
        marginTop: 12
    },

    tag: {
        color: Colours.text.default,
        paddingTop: 10,
        paddingRight: 16,
        paddingBottom: 10,
        paddingLeft: 16,
        borderColor: Colours.border.light,
        borderWidth: 1,
        borderRadius: 3
    },

    selectedTag: {
        borderColor: Colours.button.positive
    }
});