import { StyleSheet } from 'react-native';
import Colours from '@lib/colours';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background.default,
        padding: 15
    },

    loadingContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: Colours.background.default
    },

    error: {
        flex: 1,
        textAlign: 'center',
        fontStyle: 'italic',
        color: Colours.text.lowlight
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 14
    },

    headerOwner: {
        flex: 2,
        fontFamily: 'Lato',
        fontSize: 22,
        color: Colours.text.default,
        // textTransform: 'uppercase'
    },

    headerAmount: {
        fontFamily: 'Lato',
        fontSize: 22,
        color: Colours.text.default,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },

    transaction: {
        flex: 1,
        flexDirection: 'row',
        padding: 14,
        marginTop: 4,
        backgroundColor: Colours.background.light,
    },

    transactionDate: {
        flex: 1,
        color: Colours.text.lowlight,
        fontSize: 12,
        fontFamily: 'Lato'
    },

    transactionDescription: {
        flex: 2,
        color: Colours.text.default,
        fontSize: 12,
        fontFamily: 'Lato'
    },

    transactionAmount: {
        flex: 1,
        color: Colours.text.default,
        fontSize: 12,
        textAlign: 'right',
        fontFamily: 'Lato',
        fontWeight: 'bold'
    }
});