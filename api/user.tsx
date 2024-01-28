import { SupaUser } from "@/interfaces/User";
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

const fetchSupaUser = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    let { data: users, error } = await supabase
        .from("users")
        .select("name, last_name, avatar, token, external_provider")
        .eq("id", user.id);

    if (!users) return;

    const initializedUser: SupaUser = {
        id: user.id,
        name:
            users[0].name +
            " " +
            (users[0].last_name == null ? "" : users[0].last_name),
        email: user.email ? user.email : "",
        avatar:
            users[0].avatar == null
                ? "https://ckcwfpbvhbstslprlbgr.supabase.co/storage/v1/object/public/avatars/default_avatar.png?t=2023-12-19T02%3A43%3A15.423Z"
                : users[0].avatar,
        token: users[0].token,
        external_provider: users[0].external_provider,
    };

    return initializedUser;
};

const useUserData = () => {
    return useQuery({
        queryKey: ["userData"],
        queryFn: fetchSupaUser,
    });
};

export { useUserData };
