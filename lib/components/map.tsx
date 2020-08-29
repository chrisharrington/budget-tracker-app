import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IGraphProps {

}

export default class Map extends React.Component<IGraphProps> {
    render() {
        return <View style={styles.container}>
            <Text>map</Text>
        </View>;
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25
    }
});