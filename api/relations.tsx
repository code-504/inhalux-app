import { ListMonitor } from "@/interfaces/Monitor";
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

const fetchSupaMonitors = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const query = supabase
    .from("user_relations")
        .select(
            `id, 
            name_from_patient,
            pending_state,
            user: fk_user_monitor ( name, last_name, avatar, id )`
        )
        .eq("fk_user_patient", user.id)
        //.like("user.name", "%" + search + "%")
        .order("name_from_patient", { ascending: true });

    const { data, error } = await query;
    console.log("data en la api MONITORES: ", data);
    if (error) throw error;
    if (!data) return {};
            
    let transformedMonitorData = data
        .filter((monitor: any) => monitor.user !== null)
        .map(
            (monitor: any): ListMonitor => ({
                id: monitor.user.id,
                name:
                    monitor.user.name +
                    (monitor.user.last_name
                        ? " " + monitor.user.last_name
                        : ""),
                avatar: monitor.user.avatar,
                kindred: monitor.name_from_patient
                    ? monitor.name_from_patient
                    : "Relativo",
                pending_state: monitor.pending_state,
            })
        );
    
    console.log("data en la api MONITORES transformada: ", transformedMonitorData);
    return transformedMonitorData
};

const fetchSupaPacients = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const query = supabase
        .from("user_relations")
        .select(
            `id, 
            name_from_monitor,
            pending_state,
            user: fk_user_patient ( name, last_name, avatar, id )`
        )
        .eq("fk_user_monitor", user.id)
        //.like("user.name", "%" + search + "%")
        .order("name_from_monitor", { ascending: true });

    const { data, error } = await query;    

    if (error) throw error;
    if (!data) return {};
            
    let transformedPatientData = data
        .filter((patient: any) => patient.user !== null)
        .map(
            (patient: any): ListMonitor => ({
                id: patient.user.id,
                name:
                    patient.user.name +
                    (patient.user.last_name
                        ? " " + patient.user.last_name
                        : ""),
                avatar: patient.user.avatar,
                kindred: patient.name_from_monitor
                    ? patient.name_from_monitor
                    : "Relativo",
                pending_state: patient.pending_state,
            })
        );
    
    return transformedPatientData;
};

const usePacientsData = () => {
    return useQuery({
        queryKey: ["pacientsData"],
        queryFn: fetchSupaPacients,
        initialData: null
    });
};

const useMonitorsData = () => {
    return useQuery({
        queryKey: ["monitorsData"],
        queryFn: fetchSupaMonitors,
        initialData: null
    });
};

export { usePacientsData, useMonitorsData };
