export function formatTotalTime(totalTime: number): string {
    const hours = Math.floor(totalTime / 3600);
    totalTime = totalTime % 3600;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    return `${hours}H ${minutes}M ${seconds}S`;
}
