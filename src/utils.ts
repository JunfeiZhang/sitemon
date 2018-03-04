export function formatDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    duration = duration % 3600;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${hours}H ${minutes}M ${seconds}S`;
}
