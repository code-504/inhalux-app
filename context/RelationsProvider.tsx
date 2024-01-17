import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { useContext, useEffect, useState, createContext } from 'react';
import { supabase } from '@/services/supabase';
import { ListMonitor, ListMonitorState } from '@/interfaces/Monitor';
import { useAuth } from './Authprovider';

interface Props {
  children?: React.ReactNode;
}

export interface RelationContextType {
    shareState: ListMonitorState;
    setShareState: Dispatch<React.SetStateAction<ListMonitorState>>;
    pacientState: ListMonitorState;
    setPacientState: Dispatch<React.SetStateAction<ListMonitorState>>;
    fetchPacientsDataTest: (filterText: string) => Promise<ListMonitor[] | undefined>
}

export const RelationContext = createContext<RelationContextType | undefined>(
  undefined
);

export function RelationProvider({ children }: Props) {

    const [pacientState, setPacientState] = useState<ListMonitorState>({
      data: [],
      filterText: "",
      loading: true
    });

    const [shareState, setShareState] = useState<ListMonitorState>({
      data: [],
      filterText: "",
      loading: true
    });

    const auth = useAuth();

    const fetchPacientsData = useCallback(async () => {
      try {
        setPacientState({
          ...pacientState,
          loading: true
        })

        const { data: { user } } = await supabase.auth.getUser()

        if(!user) return;

        const query = supabase.from('user_relations').select(`
          id, 
          name_from_monitor,
          pending_state,
          user: fk_user_patient ( name, last_name, avatar, id )
        `)
        .eq('fk_user_monitor', user.id)
        .like("user.name", '%' + pacientState.filterText + '%')
        .order('name_from_monitor', { ascending: true });

        const { data, error } = await query;

        //console.log("pacients", data)

        if (error)
          throw error;

        if (!data) {
          setPacientState({
            ...pacientState,
            data: [],
            loading: false
          })

          return
        }

        let transformedPatientData = data.filter((patient: any) => patient.user !== null).map((patient: any): ListMonitor => ({
          id: patient.user.id,
          name: patient.user.name + ( patient.user.last_name ? " " + patient.user.last_name : ""),
          avatar: patient.user.avatar,
          kindred: patient.name_from_monitor ? patient.name_from_monitor : "Relativo",
          pending_state: patient.pending_state
        }));

        setPacientState({
          ...pacientState,
          data: transformedPatientData,
          loading: false
        })
        
      } catch(error) {
        setPacientState({
          ...pacientState,
          data: [],
          loading: false
        })
      }
  }, [pacientState.filterText])

  const fetchShareData = useCallback(async () => {
    try {
      setShareState({
        ...shareState,
        loading: true
      })

      const { data: { user } } = await supabase.auth.getUser()

      if(!user) return;

      const query = supabase.from('user_relations').select(`
        id, 
        name_from_patient,
        pending_state,
        user: fk_user_monitor ( name, last_name, avatar, id )
      `)
      .eq('fk_user_patient', user.id)
      .like("user.name", '%' + shareState.filterText + '%')
      .order('name_from_patient', { ascending: true });

      const { data, error } = await query;

      //console.log("monitor", data)

      if (error)
        throw error;

      if (!data) {
        setShareState({
          ...shareState,
          data: [],
          loading: false
        })

        return
      }

      let transformedShareData = data.filter((patient: any) => patient.user !== null).map((share: any): ListMonitor => ({
        id: share.user.id,
        name: share.user.name + ( share.user.last_name ? " " + share.user.last_name : ""),
        avatar: share.user.avatar,
        kindred: share.name_from_monitor ? share.name_from_monitor : "Relativo",
        pending_state: share.pending_state
      }));

      console.log(transformedShareData);

      setShareState({
        ...shareState,
        data: transformedShareData,
        loading: false
      })
      
    } catch(error) {
      setShareState({
        ...shareState,
        data: [],
        loading: false
      })
    }
  }, [shareState.filterText])

  useEffect(() => {
    fetchPacientsData()
  }, [pacientState.filterText, auth.session]);

  useEffect(() => {
    fetchShareData()
  }, [shareState.filterText, auth.session]);
    

  const fetchPacientsDataTest = async (filterText: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if(!user) return;

      const query = supabase.from('user_relations').select(`
        id, 
        name_from_monitor,
        pending_state,
        user: fk_user_patient ( name, last_name, avatar, id )
      `)
      .eq('fk_user_monitor', user.id)
      .like("user.name", '%' + filterText + '%')
      .order('name_from_monitor', { ascending: true });

      const { data, error } = await query;

      //console.log("pacients", data)

      if (error)
        throw error;

      if (!data) {

        return
      }

      let transformedPatientData = data.filter((patient: any) => patient.user !== null).map((patient: any): ListMonitor => ({
        id: patient.user.id,
        name: patient.user.name + ( patient.user.last_name ? " " + patient.user.last_name : ""),
        avatar: patient.user.avatar,
        kindred: patient.name_from_monitor ? patient.name_from_monitor : "Relativo",
        pending_state: patient.pending_state
      }));

      return transformedPatientData;
      
    } catch(error) {
      console.log(error)
    }
}

  return (
    <RelationContext.Provider value={
        {
          pacientState,
          setPacientState,
          shareState,
          setShareState,
          fetchPacientsDataTest
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