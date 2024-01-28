export interface Notifications {
    id: string;
    title: string;
    description: string;
    date: string;
}

export interface Notification {
    supaNotifications: Notifications[] | null;
}
