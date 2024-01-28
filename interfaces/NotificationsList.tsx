export interface NotificationsListProps {
    title: string;
    children: React.ReactElement<NotificationsListView> | React.ReactElement<NotificationsListView>[];
}

export interface NotificationsListView {
    children: React.ReactElement | JSX.Element | JSX.Element[] | React.ReactElement[];
    value: boolean;
}

export interface NotificationsListText {
    children: string
}