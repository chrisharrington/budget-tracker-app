import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Colours from '@lib/colours';

type Props = {
    error: Error | string;
}

export const Error = ({ error } : Props) => {
    return <View style={styles.container}>
        <Text style={styles.text}>
            {(error as Error).stack ? (error as Error).stack : error.toString()}
        </Text>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background.negative,
        borderRadius: 5,
        padding: 15,
        paddingTop: 15 + (StatusBar.currentHeight || 0)
    },

    text: {
        color: Colours.text.default
    },
});