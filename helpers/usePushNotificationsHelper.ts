import { useAuth } from "@/context/Authprovider"
import { supabase } from "@/services/supabase"
import { measure } from "react-native-reanimated";
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from "expo-background-fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

export const createInhalationRegister = async(id: string, hour: string, date: string) => {
    /*TaskManager.defineTask('mi-tarea', async() => {
        const userId = await AsyncStorage.getItem('inhalux_user_id')
        console.log("a ver si es cierto: ", userId);
        
        //const userId = (await supabase.auth.getSession()).data.session?.user.id;
      
          const { data: d, error: e } = await supabase
              .from('historial')
              .insert([
                  { 
                      id: id,
                      fk_user_id: userId, 
                      state: 'Pendiente',
                      message: 'La inhalación esta pendiente'
                  },
              ])
              .select()
      
              console.log("data: ", d, "error: ", e);
      });

      await Notifications.registerTaskAsync('mi-tarea', );
    /**///const userId = await AsyncStorage.getItem('inhalux_user_id')
    console.log(date);
    const supabaseString = (await supabase.auth.getSession()).data.session?.user.id;

    const { data, error } = await supabase
        .from('historial')
        .insert([
            { 
                id: id,
                fk_user_id: supabaseString,
                date: date, 
                hour: hour,
                state: 'Pendiente',
                message: 'La inhalación esta pendiente'
            },
        ])
        .select()

        console.log("data: ", data, "error: ", error);
} //create...

export const updateInhalationRegister = async(id: string, state: string) => {
    console.log("id", id);
    let message = "";

    if(state === "Realizado") message = "Se registró la inhalación";
    else message = "Se omitió la inhalación";
    
    const { data, error } = await supabase
        .from('historial')
        .update({ 
            state: state,
            message: message
        })
        .eq('id', id)
        .select()

    console.log("data: ", data, "error: ", error);
} 

export const checkInhalationState = async(id: string) => {
    console.log("id", id);

    const { data: stateData, error: stateError } = await supabase
      .from('historial')
      .select("state")
      .eq('id', id)
      .single()

    console.log("data: ", stateData, "error: ", stateError);
    
    if(stateData?.state === "Pendiente"){
        const { data, error } = await supabase
        .from('historial')
        .update({ 
            state: "No registrada",
            message: "La inhalación NO fue registrada"
        })
        .eq('id', id)
        .select()
        console.log("data: ", data, "error: ", error);
    }
} 

export const getTodayDate = () => {
    // Obtener la fecha actual
    const fechaActual: Date = new Date();

    // Días de la semana
    const diasSemana: string[] = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    // Meses
    const meses: string[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // Obtener el día, mes y año
    const dia: number = fechaActual.getDate();
    const diaSemana: string = diasSemana[fechaActual.getDay()];
    const mes: string = meses[fechaActual.getMonth()];
    const ano: number = fechaActual.getFullYear();

    // Formatear la fecha según tu ejemplo
    const fechaFormateada: string = `Tratamiento del ${diaSemana} ${dia} de ${mes} del ${ano}`;

    // Mostrar la fecha formateada
    console.log("FechaFormateada ", fechaFormateada);
    return fechaFormateada;
}