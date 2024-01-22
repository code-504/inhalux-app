export const getDate = (count: number, date_init ?: string): Date => {
    const date = new Date(date_init || Date.now());
    date.setDate(date.getDate() + count);
    return date
};