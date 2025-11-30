import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Colours from '@lib/colours';

type Props = {

}

export const Loader = ({ }: Props) => {
    return <View style={styles.container}>
        <ActivityIndicator size={48} color={Colours.text.positive} />
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: Colours.background.default
    }
});