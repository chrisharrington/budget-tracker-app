import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, AppState, AppStateStatus } from 'react-native';
import dayjs from 'dayjs';

import Colours from '../colours';

import { History } from '../models';

import BudgetApi from '../data/budget';
import CurrencyHelper from '../helpers/currency';


interface IHistoryViewProps {
    style?: any;
    appState: AppStateStatus;
    onError: (message: string) => void;
}

interface IHistoryViewState {
    history: History[];
    refreshing: boolean;
}

export default class HistoryView extends React.Component<IHistoryViewProps, IHistoryViewState> {
    state = {
        history: [],
        refreshing: false,
    }

    async componentDidMount() {
        await this.getHistory();
    }

    async componentDidUpdate(prev: IHistoryViewProps) {
        if (prev.appState.match(/background|inactive/) && this.props.appState === 'active')
            await this.getHistory();
    }

    render() {
        return <ScrollView
            style={[styles.container, this.props.style]}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={async () => await this.getHistory()}/>}
        >
            <View style={styles.header}>
                <Text style={[styles.baseCell, styles.headerCell]}>Week</Text>
                <Text style={[styles.baseCell, styles.headerCell, styles.rightCell]}>Balance</Text>
            </View>

            {this.state.history.map((history: History, index: number) => {
                const date = dayjs(history.date).format('MM/DD');
                return <View key={date + history.balance} style={[styles.row, index%2 === 0 ? styles.rowEven : styles.rowOdd]}>
                    <Text style={[styles.baseCell, styles.rowCell]}>{date}</Text>
                    <Text style={[styles.baseCell, styles.rowCell, styles.rightCell, styles.balance, history.balance < 0 ? styles.balanceNegative : styles.balancePositive]}>{CurrencyHelper.format(history.balance)}</Text>
                </View>;
            })}
        </ScrollView>;
    }

    private async getHistory() {
        this.setState({
            history: await BudgetApi.history()
        });
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background.default,
        paddingTop: 15
    },

    text: {
        color: 'white'
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 15
    },

    baseCell: {
        flex: 1,
        fontFamily: 'Lato'
    },

    headerCell: {
        fontWeight: 'bold',
        color: Colours.text.lowlight,
        textTransform: 'uppercase',
        fontSize: 12
    },

    rightCell: {
        textAlign: 'right'
    },

    row: {
        width: '100%',
        flexDirection: 'row',
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 15,
        paddingBottom: 15
    },

    rowEven: {
        backgroundColor: Colours.background.light
    },

    rowOdd: {
        backgroundColor: Colours.background.default
    },

    rowCell: {
        color: Colours.text.default,
    },

    balance: {
        fontWeight: 'bold'
    },

    balancePositive: {
        color: Colours.text.success
    },

    balanceNegative: {
        color: Colours.text.error
    }
});