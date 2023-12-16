import React, { Dispatch, SetStateAction } from 'react';
import { useContext, useEffect, useState, createContext } from 'react';
import { supabase } from '@/services/supabase';

interface Props {
  children?: React.ReactNode;
}

export interface RelationContextType {
    supaMonitors: any[] | null;
    setSupaMonitors: Dispatch<SetStateAction<any[] | null>>;
    supaPatients: any[] | null;
    setSupaPatients: Dispatch<SetStateAction<any[] | null>>;
}

export const RelationContext = createContext<RelationContextType | undefined>(
  undefined
);

export function RelationProvider({ children }: Props) {

    const [supaMonitors, setSupaMonitors] = useState<any | null>(null);
    const [supaPatients, setSupaPatients] = useState<any | null>(null);

  useEffect(() => {

    const fetchSupaRelations = async () => {
      const { data: { user } } = await supabase.auth.getUser()
  
      if(!user) return;

      const { data: monitorData, error: monitorError } = await supabase.from('user_relations').select(`
          id, 
          name_from_patient,
          user: fk_user_monitor ( name )
        `)
        .eq('fk_user_patient', user.id)
        .order('name_from_patient', { ascending: true })

      const {data: patientData, error: patientError } = await supabase.from('user_relations').select(`
        id, 
        name_from_monitor,
        user: fk_user_patient ( name, last_name )
      `)
        .eq('fk_user_monitor', user.id)
        .order('name_from_monitor', { ascending: true });;
  
        const transformedMonitorData = monitorData?.map((monitor: any) => ({
            name: monitor.user.name + ( monitor.user.last_name ? " " + monitor.user.last_name : ""),
            avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            kindred: monitor.name_from_patient ? monitor.name_from_patient : "Relativo",
        }));

        const transformedPatientData = patientData?.map((patient: any) => ({
          name: patient.user.name + ( patient.user.last_name ? " " + patient.user.last_name : ""),
          avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          kindred: patient.name_from_monitor ? patient.name_from_monitor : "Relativo",
      }));
    
        setSupaMonitors(transformedMonitorData);
        //console.log("Monitores: ", transformedMonitorData)
        setSupaPatients(transformedPatientData);
        //console.log("Pacientes: ", transformedPatientData)
  
    };

    fetchSupaRelations();

  }, []);

  return (
    <RelationContext.Provider value={
        {
          supaMonitors, 
          setSupaMonitors,
          supaPatients, 
          setSupaPatients
        }
      }>
      {children}
    </RelationContext.Provider>
  );
}

export const useRelations = () => {
  const context = useContext(RelationContext);
  if (context === undefined) {
    throw new Error(`useRelation must be used within a MyUserContextProvider.`);
  }
  return context;
};