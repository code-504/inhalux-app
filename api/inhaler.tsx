import { supabase } from "@/services/supabase";
import { useQuery } from "react-query";

const fetchData = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: inhalersData, error: inhalersError } = await supabase
        .from("inhalers")
        .select(
            `
              id, 
              name,
              inhaler_state ( dosis, battery ),
              inhaler_ubication ( latitude, longitude, altitude, last_seen, address )
              `
        )
        .eq("fk_user_id", user.id)
        .order("name", { ascending: true });

    if (inhalersData) {
        const transformedData = inhalersData.map((inhaler: any) => ({
            id: inhaler.id,
            title: inhaler.name,
            connection: `Hace ${calculateDaysAgo(
                inhaler.inhaler_ubication.last_seen
            )}`,
            battery: inhaler.inhaler_state.battery,
            dosis: inhaler.inhaler_state.dosis,
            altitude: inhaler.inhaler_ubication.altitude,
            longitude: inhaler.inhaler_ubication.longitude,
            latitude: inhaler.inhaler_ubication.latitude,
            address: inhaler.inhaler_ubication.address,
        }));
        setSupaInhalers(transformedData);
        //console.log("inhalersData", inhalersData);
        //console.log("transformedData", transformedData);
    }
};

const useSupabaseData = () => {
    return useQuery("supabaseData", fetchData);
};
