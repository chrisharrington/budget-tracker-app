import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './style';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@lib/models';

type Props = BottomTabScreenProps<TabParamList, 'Quinn' | 'Zoe'>;

export const QuinnAllowancesScreen = (props : Props) => <AllowancesScreen {...props} owner='quinn' />;
export const ZoeAllowancesScreen = (props : Props) => <AllowancesScreen {...props} owner='zoe' />;

const AllowancesScreen = ({ owner } : Props & { owner: string }) => {
    return <View style={styles.container}>
        <Text style={{ color: 'white' }}>{owner}</Text>
    </View>;
}