export default class CurrencyHelper {
    static format(value: number) {
        const negative = value < 0;
        return `${negative ? '-' : ''}$${Math.abs(value).toFixed(2)}`;
    }
}