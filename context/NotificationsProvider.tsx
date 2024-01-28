import React, { Dispatch, SetStateAction } from "react";
import { useContext, useEffect, useState, createContext } from "react";
import { supabase } from "@/services/supabase";
import { useUserStore } from "@/stores/user";

interface Props {
    children?: React.ReactNode;
}

export interface NotificationContextType {
    supaNotifications: any[];
    setSupaNotifications: Dispatch<SetStateAction<any[]>>;
}

export const NotificationContext = createContext<
    NotificationContextType | undefined
>(undefined);

export function NotificationProvider({ children }: Props) {
    const [supaNotifications, setSupaNotifications] = useState<any[]>([]);
    const { session } = useUserStore();

    const fetchSupaNotifications = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: NotificationsData, error: NotificationsError } =
            await supabase
                .from("notifications")
                .select("*")
                .eq("fk_user_id", user.id);

        //console.log("Notifications", NotificationsData);
        setSupaNotifications(NotificationsData ? NotificationsData : []);
        // console.log("new supaNotifications", supaNotifications);
    };

    useEffect(() => {
        fetchSupaNotifications();
    }, [session]);

    return (
        <NotificationContext.Provider
            value={{
                supaNotifications,
                setSupaNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            `useNotification must be used within a MyUserContextProvider.`
        );
    }
    return context;
};
