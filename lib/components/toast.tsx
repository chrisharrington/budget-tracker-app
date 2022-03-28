import * as React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

import Colours from '../colours';

export enum ToastType {
    Error,
    Success
}

interface IToastState {
    message: string;
    type: ToastType;
    opacity: Animated.Value;
    position: Animated.Value;
}

export class Toast extends React.Component<{}, IToastState> {
    private timeout: any;

    state = {
        message: '',
        type: ToastType.Success,
        opacity: new Animated.Value(0),
        position: new Animated.Value(25)
    }

    render() {
        return <Animated.View style={[
            styles.container,
            { opacity: this.state.opacity, transform: [{ translateY: this.state.position }] }
        ]}>
            <View style={[styles.wrapper, { backgroundColor: this.getBackgroundColour(this.state.type) }]}>
                <Text style={styles.text}>{this.state.message}</Text>
            </View>
        </Animated.View>;
    }

    async clear() : Promise<void> {
        await this.toggle(false);
        this.setState({ message: '' });
    }

    async error(message: string) : Promise<void> {
        await this.message(message, ToastType.Error);
    }

    async success(message: string) : Promise<void> {
        await this.message(message, ToastType.Success);
    }

    private async message(message: string, type: ToastType) : Promise<void> {
        const previous = this.state.message,
            current = message;

        if (!previous && current) {
            this.setState({ message: current, type });
            await this.toggle(true);
        } else if (previous && current) {
            await this.toggle(false);
            this.setState({ message: current, type });
            await this.toggle(true);
        }

        if (this.timeout)
            clearTimeout(this.timeout);

        this.timeout = setTimeout(() => this.clear(), 5000);
    }

    private getBackgroundColour(type: ToastType) : string {
        switch (type) {
            case ToastType.Error:
                return Colours.background.error;
            case ToastType.Success:
                return Colours.background.success;
            default:
                return Colours.background.default;
        }
    }

    private async toggle(visible: boolean) : Promise<void> {
        return new Promise<void>(resolve => {
            Animated.timing(this.state.opacity, {
                toValue: visible ? 1 : 0,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.linear
            }).start();

            Animated.timing(this.state.position, {
                toValue: visible ? 0 : 25,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.linear
            }).start();

            setTimeout(() => resolve(), 200);
        });
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        bottom: 25,
        transform: [{ translateY: 25 }],
        zIndex: 10000000,
        paddingHorizontal: 20
    },

    wrapper: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3,
        alignSelf: 'center'
    },

    text: {
        color: Colours.text.default
    }
});