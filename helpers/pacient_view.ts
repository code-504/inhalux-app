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
}}//getPacientInhalers

export const checkIfPacientHasTreatment = async(id: string) => {
    const { data: treatmentData, error: treatmentError } = await supabase
        .from('treatment')
        .select("*")
        .eq('fk_user_id', id)
        .single()

    if(treatmentData) return true;
    else return false;
}//checkIfPacientHasTreatment

export const getHistorialData = async(id: string) => {
    const { data: historialData, error: historialError } = await supabase
        .from('historial')
        .select("*")
        .eq('fk_user_id', id)

    if(!historialData) return [];
    else{
        const transformedData = transformHistorialData(historialData);
        return transformedData;
    }
    
}//getHistorialData

interface TreatmentData {
  title: string;
  message: string;
  hour: string;
  type: number;
}

interface GroupedData {
  title: string;
  data: TreatmentData[];
}

const transformHistorialData = (arreglo: any[]): GroupedData[] => {
  const groupedByDate: Record<string, GroupedData> = {};

  arreglo.forEach((item: { state: string, date: string, message: string }) => {
      // Obtener la fecha sin la hora para agrupar
      const date = new Date(item.date).toLocaleDateString();

      // Crear la estructura si no existe
      if (!groupedByDate[date]) {
          groupedByDate[date] = {
              title: date,
              data: [],
          };
      }

      let title: string, type: number;
      
      switch (item.state) {
          case 'Realizado':
              title = 'Tratamiento Realizado';
              type = 0;
              break;
          case 'Omitido':
              title = 'Tratamiento Omitido';
              type = 1;
              break;
          case 'Pendiente':
              title = 'Tratamiento Pendiente';
              type = 2;
              break;
          default:
              title = 'Tratamiento Desconocido';
              type = -1;
      }

      // Obtener la hora de la fecha
      const hour = new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Agregar el elemento al grupo correspondiente
      groupedByDate[date].data.push({
          title,
          message: item.message,
          hour,
          type
      });
  });

  // Convertir el objeto de grupos a un arreglo y ordenarlo por fecha
  const nuevoArreglo = Object.values(groupedByDate).sort((a, b) => new Date(b.title).getTime() - new Date(a.title).getTime());

  return nuevoArreglo;
}

  

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
