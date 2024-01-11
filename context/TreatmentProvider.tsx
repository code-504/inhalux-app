import React, { Dispatch, SetStateAction } from 'react';
import { useContext, useEffect, useState, createContext } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from './Authprovider';

interface Props {
  children?: React.ReactNode;
}

export interface TreatmentContextType {
  supaTreatment: Object | null;
  setSupaTreatment: Dispatch<SetStateAction<any[] | null>>;
}

export const TreatmentContext = createContext<TreatmentContextType | undefined>(
  undefined
);

export function TreatmentProvider({ children }: Props) {

  const [supaTreatment, setSupaTreatment] = useState<any | null>(null);
  const auth = useAuth();

  const fetchSupaTreatment = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if(!user) return;

    let { data: treatmentData, error: treatmentError } = await supabase
      .from('treatment')
      .select("*")
      .eq('fk_user_id', user.id)

    if(!treatmentData) return;
    console.log("treatmentData", treatmentData[0].treatment);  
    setSupaTreatment(treatmentData?.length > 0 
      ? 
        {
          days: treatmentData[0].treatment.days,
          hours: treatmentData[0].treatment.hours,
        } 
      : 
        null);
  };

  useEffect(() => {

    fetchSupaTreatment();

  }, [auth.session]);

  return (
    <TreatmentContext.Provider value={
        {
          supaTreatment, 
          setSupaTreatment
        }
      }>
      {children}
    </TreatmentContext.Provider>
  );
}

export const useTreatment = () => {
  const context = useContext(TreatmentContext);
  if (context === undefined) {
    throw new Error(`useTreatment must be used within a MyUserContextProvider.`);
  }
  return context;
};