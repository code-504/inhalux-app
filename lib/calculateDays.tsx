export const calculateDaysAgo = (lastSeen: string): string => {
    const today = new Date();
    const lastSeenDate = new Date(lastSeen);
    const differenceInMilliseconds = today.getTime() - lastSeenDate.getTime();
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    if(differenceInDays === -1) return "un momento"; 
    else return `${differenceInDays} días`;
};