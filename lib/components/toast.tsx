import * as React from 'react';
import { useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Colours from '../colours';

export enum ToastType {
    Error,
    Success
}

export type ToastHandle = {
    clear: () => void;
    error: (message: string) => void;
    success: (message: string) => void;
}

export const Toast = React.forwardRef<ToastHandle>((_, ref) => {
    const opacity = useRef<Animated.Value>(new Animated.Value(0)),
        position = useRef<Animated.Value>(new Animated.Value(25)),
        [message, setMessage] = useState<string>(''),
        [type, setType] = useState<ToastType>(ToastType.Success),
        timeout = useRef<any>();

    useImperativeHandle(ref, () => ({ clear, error, success }));

    return <Animated.View style={[
        styles.container,
        { opacity: opacity.current, transform: [{ translateY: position.current }] }
    ]}>
        <View style={[styles.wrapper, { backgroundColor: getBackgroundColour(type) }]}>
            <Text style={styles.text}>{message}</Text>
        </View>
    </Animated.View>;

    async function clear() : Promise<void> {
        await toggle(false);
        setMessage('');
    }

    async function error(message: string) : Promise<void> {
        await messageInternal(message, ToastType.Error);
    }

    async function success(message: string) : Promise<void> {
        await messageInternal(message, ToastType.Success);
    }

    async function messageInternal(newMessage: string, type: ToastType) : Promise<void> {
        const previous = message,
            current = newMessage;

        if (!previous && current) {
            setMessage(current);
            setType(type);
            await toggle(true);
        } else if (previous && current) {
            await toggle(false);
            setMessage(current);
            setType(type);
            await toggle(true);
        }

        if (timeout.current)
            clearTimeout(timeout.current);

        timeout.current = setTimeout(() => clear(), 5000);
    }

    function getBackgroundColour(type: ToastType) : string {
        switch (type) {
            case ToastType.Error:
                return Colours.background.negative;
            case ToastType.Success:
                return Colours.background.positive;
            default:
                return Colours.background.default;
        }
    }

    async function toggle(visible: boolean) : Promise<void> {
        return new Promise<void>(resolve => {
            Animated.timing(opacity.current, {
                toValue: visible ? 1 : 0,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.linear
            }).start();

            Animated.timing(position.current, {
                toValue: visible ? 0 : 25,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.linear
            }).start();

            setTimeout(() => resolve(), 200);
        });
    }
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        bottom: 25,
        transform: [{ translateY: 25 }],
        zIndex: 10000000,
        paddingHorizontal: 20,
        pointerEvents: 'none'
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