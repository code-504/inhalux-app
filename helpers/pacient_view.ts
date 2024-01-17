import { supabase } from "@/services/supabase";

export const getPacientInhalers = async(id: string) => {
    const { data: inhalersData, error: inhalersError } = await supabase.from('inhalers').select(`
    id, 
    name,
    inhaler_state ( dosis, battery, pulsations ),
    inhaler_ubication (last_seen)
    `)
    .eq('fk_user_id', id)
    .order('name', { ascending: true })
  
    if (inhalersData) {
      const transformedData = inhalersData.map((inhaler: any) => ({
        id: inhaler.id,
        title: inhaler.name,
        connection: `${calculateTimeAgo(inhaler.inhaler_ubication.last_seen)}`,
        battery: inhaler.inhaler_state.battery,
        dosis: inhaler.inhaler_state.dosis,
        pulsations: inhaler.inhaler_state.pulsations
      }));

    return transformedData;
}}

const calculateTimeAgo = (lastSeen: string): string => {
    const today = new Date();
    const lastSeenDate = new Date(lastSeen);
    const differenceInMilliseconds = Math.abs(today.getTime() - lastSeenDate.getTime());

    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInMilliseconds < 1) {
        return "hace un momento";
    } else if (differenceInMinutes < 1) {
        return `hace ${differenceInSeconds} segundos`;
    } else if (differenceInHours < 1) {
        return `hace ${differenceInMinutes} minutos`;
    } else if (differenceInDays < 1) {
        return `hace ${differenceInHours} horas`;
    } else {
        return `${differenceInDays} días`;
    }
};
