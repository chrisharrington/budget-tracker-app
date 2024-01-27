import React from 'react';
import { View, Text, StyleSheet, StatusBar as ReactStatusBar } from 'react-native';
import Colours from '@lib/colours';

type Props = {

}

export const AllowancesScreen = ({} : Props) => {
    return <View style={styles.container}>
        <Text style={{ color: 'white' }}>allowances</Text>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background.default,
        paddingTop: ReactStatusBar.currentHeight
    }
});