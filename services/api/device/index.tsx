import { calculateDaysAgo } from "@/lib/calculateDays";
import { supabase } from "@/services/supabase"

export const getInhalers = async (user_id:string | undefined): Promise<any[]> => {

    try {
        if (!user_id) {
            throw "Error: debe de iniciar sesión"
        }

        const { data, error } = await supabase.from('inhalers').select(`
            id, 
            name,
            inhaler_state ( dosis, battery ),
            inhaler_ubication ( last_seen )
        `).eq('fk_user_id', user_id)

        if (error)
            throw error;

        const transformedData = data.map((item, index) => ({
            id: index,
            title: item.name,
            connection: calculateDaysAgo(item.inhaler_ubication.last_seen),
            battery: item.inhaler_state.battery,
            dose: item.inhaler_state.dosis
        }));

        return transformedData;

    } catch (error) {
        console.log(error)
        return [];
    }
}