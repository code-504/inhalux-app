import { Inhalers } from "@/interfaces/Device";
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

const calculateDaysAgo = (lastSeen: string): string => {
    const today = new Date();
    const lastSeenDate = new Date(lastSeen);
    const differenceInMilliseconds = today.getTime() - lastSeenDate.getTime();
    const differenceInDays = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays === -1) return "un momento";
    else return `${differenceInDays} días`;
};

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


    return NotificationsData;
};

const useNotificationsData = () => {
    return useQuery({
        queryKey: ["notificationsData"],
        queryFn: fetchSupaNotifications,
        initialData: null,
    });
};

export { useNotificationsData };
