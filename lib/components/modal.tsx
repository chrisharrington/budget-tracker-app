import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ReactModal from 'react-native-modal';
import dayjs from 'dayjs';

import { Tag, Transaction } from '../models';
import Colours from '../colours';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    saveButtonText?: string;
    saveButtonDisabled?: boolean;
}

export default class Modal extends React.Component<ModalProps> {
    render() {
        return <ReactModal
            isVisible={this.props.visible}
            backdropOpacity={0.4}
            hideModalContentWhileAnimating={true}
            backdropTransitionOutTiming={0}
            style={styles.modal}
        >
            <View style={styles.inner}>
                {this.props.children}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => this.props.onClose()}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.saveButton, this.props.saveButtonDisabled ? styles.saveButtonDisabled : undefined]} disabled={this.props.saveButtonDisabled} onPress={() => this.props.onSave()}>
                        <Text style={styles.buttonText}>{this.props.saveButtonText || 'Save'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ReactModal>;
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
    },

    saveButtonDisabled: {
        backgroundColor: Colours.button.positiveDisabled
    }
});