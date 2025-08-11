export default function formatNumber(value: number | string): string {
    const num = Number(value);
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}
