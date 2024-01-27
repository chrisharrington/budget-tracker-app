import * as React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import dayjs from 'dayjs';
import Colours from '../colours';
import { Budget } from '../models';
import CurrencyHelpers from '../helpers/currency';

type Props = {
    budget: Budget;
    amount: number;
}

export const Progress = (props: Props) => {
    const budget = props.budget,
        remainingDays = React.useMemo(() => getRemainingDays(), [dayjs().startOf('d').format()]),
        amount = props.amount,
        isNegative = amount < 0;

    return <View style={styles.balanceWrapper}>
        <AnimatedCircularProgress
            size={300}
            width={10}
            fill={amount / budget.weeklyAmount * 100}
            tintColor={isNegative ? Colours.background.error : Colours.highlight.default}
            backgroundColor={isNegative ? Colours.background.error : Colours.highlight.dark}
            rotation={0}
        >
            {
                () => (
                    <View>
                        <Text style={styles.balanceText}>{CurrencyHelpers.format(amount)}</Text>
                        <Text style={styles.balanceSubText}>{`${remainingDays} day${remainingDays === 1 ? '' : 's'} remaining`}</Text>
                    </View>
                )
            }
        </AnimatedCircularProgress>
    </View>;

    function getRemainingDays() {
        let remaining = 0,
            date = dayjs().startOf('d');

        while (date.day() !== 1) {
            date = date.add(1, 'day');
            remaining++;
        }

        return remaining === 0 ? 7 : remaining;
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