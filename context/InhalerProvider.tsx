import React, { Dispatch, SetStateAction } from 'react';
import { useContext, useEffect, useState, createContext } from 'react';
import { supabase } from '@/services/supabase';

interface Props {
  children?: React.ReactNode;
}

export interface inhalerProps {
  id          : string,
  title       : string,
  battery     : string,
  dosis       : string,
  connection  : string,
  latitude    : string,
  altitude    : string,
  longitude   : string,
  address     : string
}

export interface InhalerContextType {
  supaInhalers: any[] | null;
  setSupaInhalers: Dispatch<SetStateAction<any[]>>;
  fetchSupaInhalerById: (id: string) => Promise<inhalerProps | null>;
}

export const InhalerContext = createContext<InhalerContextType | undefined>(
  undefined
);

export function InhalerProvider({ children }: Props) {

  const [supaInhalers, setSupaInhalers] = useState<any[]>([]);

  const calculateDaysAgo = (lastSeen: string): string => {
    const today = new Date();
    const lastSeenDate = new Date(lastSeen);
    const differenceInMilliseconds = today.getTime() - lastSeenDate.getTime();
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    if(differenceInDays === -1) return "un momento"; 
    else return `${differenceInDays} días`;
  };

  const fetchSupaInhalers = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if(!user) return;

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
                  dosis: inhaler.inhaler_state.dosis,
                  altitude: inhaler.inhaler_ubication.altitude,
                  longitude: inhaler.inhaler_ubication.longitude,
                  latitude: inhaler.inhaler_ubication.latitude,
                  address: inhaler.inhaler_ubication.address,
                }));
          setSupaInhalers(transformedData);
          // console.log("new supainhalers", supaInhalers);
      } 

  };

  const fetchSupaInhalerById = async (id:string): Promise<inhalerProps | null> => {
    const { data: { user } } = await supabase.auth.getUser()

    if(!user) return null;

      const { data: inhalersData, error: inhalersError } = await supabase
      .from('inhalers')
      .select(`
        id, 
        name,
        inhaler_state ( dosis, battery ),
        inhaler_ubication ( latitude, longitude, altitude, last_seen )
      `)
      .eq('fk_user_id', user.id)
      .eq('id', id)
      .single()
            
      if (inhalersData) {
        const transformedData: inhalerProps = {
          id: String(inhalersData.id),
          title: String(inhalersData.name),
          connection: String(`Hace ${calculateDaysAgo(inhalersData.inhaler_ubication.last_seen)}`),
          battery: String(inhalersData.inhaler_state.battery),
          dosis: String(inhalersData.inhaler_state.dosis),
        }

        console.log(transformedData)
        return transformedData;
      } 

      return null;
  };

  useEffect(() => {
    fetchSupaInhalers();
  }, []);

  return (
    <InhalerContext.Provider value={
        {
          supaInhalers, 
          setSupaInhalers,
          fetchSupaInhalerById
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