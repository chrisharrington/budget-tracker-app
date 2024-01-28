export default class Colours {
    static background = {
        default: '#333333',
        light: '#404040',
        dark: '#2A2A2A',
        error: '#BD1E18',
        success: '#35BD18',
        highlight: '#606060'
    };

    static highlight = {
        default: '#28DE1F',
        dark: '#105E0C'
    };

    static text = {
        default: '#FFFFFF',
        lowlight: '#AAAAAA',
        success: '#1EDF24',
        error: '#FA4539',
        positive: '#1EDF24',
        negative: '#FA4539'
    };

    static button = {
        negative: Colours.background.dark,
        positive: '#38A501',
        positiveDisabled: '#226600'
    };

    static border = {
        light: '#555555',
        dark: Colours.background.dark
    };

    static chris: string = '#46D3FF';
    static sarah: string = '#FC0FC0';
}