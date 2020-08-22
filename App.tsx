import React from 'react';
import { StyleSheet, View, StatusBar as ReactStatusBar, ScrollView, RefreshControl } from 'react-native';
import { AppLoading } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';
import dayjs from 'dayjs';

import BudgetApi from './lib/data/budget';
import { Budget } from './lib/models';
import Colours from './lib/colours';

import Progress from './lib/components/progress';
import Transactions from './lib/components/transactions';

export default () => {
    const [fontsLoaded] = useFonts({
        'Lato': Lato_400Regular
    });

    return fontsLoaded ? <App /> : <AppLoading />;
}


interface IAppState {
    budget: Budget | null;
    loading: boolean;
    refreshing: boolean;
}

class App extends React.Component<{}, IAppState> {
    state = {
        budget: null,
        loading: false,
        refreshing: false
    }

    async componentDidMount() {
        await this.getBudget();
    }

    render() {
        const budget = this.state.budget as Budget | null;
        if (budget == null)
            return <View />;

        const amount = budget.weeklyAmount - budget.items.filter(b => !b.ignored).map(b => b.amount).reduce((sum, amount) => sum + amount, 0);
        return <View style={styles.container}>
            <StatusBar
                style='light'
            />

            <ScrollView
                style={styles.scroll}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={async () => await this.getBudget()}/>}
            >
                <Progress
                    budget={budget}
                    amount={amount}
                />

                <Transactions
                    budget={budget}
                    onBudgetChanged={(budget: Budget) => this.onBudgetChanged(budget)}
                />
                
            </ScrollView>
        </View>;
    }

    private async getBudget() {
        this.setState({
            budget: await BudgetApi.get()
        });
    }

    private onBudgetChanged(budget: Budget) {
        this.setState({ budget });
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background,
        flexDirection: 'column',
        paddingTop: ReactStatusBar.currentHeight
    },

    scroll: {
        
    }
});
