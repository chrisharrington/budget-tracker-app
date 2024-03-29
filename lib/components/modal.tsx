import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ReactModal from 'react-native-modal';
import Colours from '../colours';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    saveButtonText?: string;
    saveButtonDisabled?: boolean;
} & React.PropsWithChildren;

export const Modal = (props : Props) => (
    <ReactModal
        isVisible={props.visible}
        backdropOpacity={0.4}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        style={styles.modal}
    >
        <View style={styles.inner}>
            {props.children}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => props.onClose()}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton, props.saveButtonDisabled ? styles.saveButtonDisabled : undefined]} disabled={props.saveButtonDisabled} onPress={() => props.onSave()}>
                    <Text style={styles.buttonText}>{props.saveButtonText || 'Save'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ReactModal>
);

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-start',
    },

    inner: {
        flex: 1,
        backgroundColor: Colours.background.default,
        padding: 25,
        borderRadius: 5
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
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