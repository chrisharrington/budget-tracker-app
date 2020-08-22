import * as React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import dayjs from 'dayjs';

import Colours from '../colours';
import { Budget } from '../models';

interface IProgressProps {
    budget: Budget;
    amount: number;
}

export default class Progress extends React.Component<IProgressProps> {
    render() {
        const budget = this.props.budget,
            remainingDays = dayjs().endOf('w').add(1, 's').diff(dayjs().startOf('d'), 'd'),
            amount = this.props.amount;

        return <View style={styles.balanceWrapper}>
            <AnimatedCircularProgress
                size={300}
                width={10}
                fill={amount / budget.weeklyAmount * 100}
                tintColor={Colours.highlight}
                backgroundColor={Colours.highlightDark}
                rotation={0}
            >
                {
                    () => (
                        <View>
                            <Text style={styles.balanceText}>{`$${amount.toFixed(2)}`}</Text>
                            <Text style={styles.balanceSubText}>{`${remainingDays} day${remainingDays === 1 ? '' : 's'} remaining`}</Text>
                        </View>
                    )
                }
            </AnimatedCircularProgress>
        </View>;
    }
}


const styles = StyleSheet.create({
    dateWrapper: {
        margin: 25
    },

    date: {
        color: Colours.text.lowlight,
        fontSize: 14
    },

    balanceWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: StatusBar.currentHeight
    },

    balanceText: {
        color: Colours.text.default,
        fontFamily: 'Lato',
        fontSize: 52   
    },

    balanceSubText: {
        color: Colours.text.lowlight,
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
        fontSize: 14
    }
});