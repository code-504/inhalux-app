import React, { Dispatch, SetStateAction } from 'react';
import { useContext, useEffect, useState, createContext } from 'react';
import { supabase } from '@/services/supabase';

interface Props {
  children?: React.ReactNode;
}

export interface InhalerContextType {
  supaInhalers: any[] | null;
  setSupaInhalers: Dispatch<SetStateAction<any[]>>;
}

export const InhalerContext = createContext<InhalerContextType | undefined>(
  undefined
);

export function InhalerProvider({ children }: Props) {

  const [supaInhalers, setSupaInhalers] = useState<any[]>([]);

  useEffect(() => {

    const fetchSupaInhalers = async () => {
      const { data: { user } } = await supabase.auth.getUser()
  
      if(!user) return;

        const calculateDaysAgo = (lastSeen: string): string => {
          const today = new Date();
          const lastSeenDate = new Date(lastSeen);
          const differenceInMilliseconds = today.getTime() - lastSeenDate.getTime();
          const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
      
          if(differenceInDays === -1) return "un momento"; 
          else return `${differenceInDays} días`;
        };

        const { data: inhalersData, error: inhalersError } = await supabase.from('inhalers').select(`
                id, 
                name,
                inhaler_state ( dosis, battery ),
                inhaler_ubication ( latitude, longitude, altitude, last_seen )
                `)
                .eq('fk_user_id', user.id)
                .order('name', { ascending: true })
              
        if (inhalersData) {
                  const transformedData = inhalersData.map((inhaler: any) => ({
                    id: inhaler.id,
                    title: inhaler.name,
                    connection: `Hace ${calculateDaysAgo(inhaler.inhaler_ubication.last_seen)}`,
                    battery: inhaler.inhaler_state.battery,
                    dose: inhaler.inhaler_state.dosis,
                  }));
                  console.log("inhalersData", inhalersData);
                  console.log("transformed", transformedData);
                  
            setSupaInhalers(transformedData);
            // console.log("new supainhalers", supaInhalers);
        } 
  
    };

    fetchSupaInhalers();
    

  }, []);

  return (
    <InhalerContext.Provider value={
        {
          supaInhalers, 
          setSupaInhalers
        }
      }>
      {children}
    </InhalerContext.Provider>
  );
}

export const useInhalers = () => {
  const context = useContext(InhalerContext);
  if (context === undefined) {
    throw new Error(`useInhaler must be used within a MyUserContextProvider.`);
  }
  return context;
};