export function getTime(): string {
    const date: Date = new Date();
    return fill(date.getHours()) + ':' + fill(date.getMinutes()) + ':' + fill(date.getSeconds());
}

function fill(number: number) {
    return "0".repeat(2 - number.toString().length) + number.toString();
}