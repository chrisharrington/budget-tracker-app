import { StyleSheet, StatusBar } from 'react-native';
import Colours from '@lib/colours';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background.default,
        paddingTop: StatusBar.currentHeight
    },

    tabBar: {
        backgroundColor: Colours.background.dark,
        height: 60,
        left: 0,
        right: 0,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row'
    },

    tabButton: {
        flex: 1,
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: Colours.background.default
    },

    tabButtonFirst: {
        borderLeftWidth: 0
    },

    tabButtonText: {
        color: Colours.text.default,
        textTransform: 'uppercase',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Lato',
        marginTop: 15,
        paddingBottom: 3
    },

    tabButtonTextSelected: {
        borderBottomWidth: 2,
        borderBottomColor: Colours.highlight.default
    },

    scrollContainer: {
        backgroundColor: Colours.background.default
    },

    loading: {
        backgroundColor: Colours.background.default,
        flex: 1
    },

    dateMenu: {
        flex: 1,
        marginTop: 25,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row'
    },

    previousDateButton: {
        width: 50,
        textAlign: 'left',
        color: Colours.text.default,
        height: 34
    },

    currentDate: {
        flexGrow: 1,
        textAlign: 'center',
        color: Colours.text.default,
        fontFamily: 'Lato',
        fontSize: 28
    },

    nextDateButton: {
        width: 50,
        textAlign: 'right',
        color: Colours.text.default,
        height: 34,
    },

    additionalDataContainer: {
        width: '100%',
        marginTop: 25,
        paddingLeft: 25,
        paddingRight: 25,
        flexDirection: 'row'
    },

    additionalDataText: {
        flex: 3,
        fontSize: 12,
        color: Colours.text.lowlight,
        fontFamily: 'Lato'
    },

    additionalDataValue: {
        flex: 1,
        fontSize: 12,
        color: Colours.text.default,
        textAlign: 'right',
        fontFamily: 'Lato'
    },

    separator: {
        flex: 1,
        height: 1,
        backgroundColor: Colours.background.light,
        marginTop: 20,
        marginHorizontal: 25,
        marginBottom: 5
    }
});