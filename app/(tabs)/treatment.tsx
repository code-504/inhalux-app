import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, CheckboxProps, Label, SizeTokens, Switch, XStack, YStack } from 'tamagui'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText';
import { SwitchWithLabel } from '@/components/SwitchWithLabel';
import { TimePickerModal } from 'react-native-paper-dates';
import Colors from '@/constants/Colors';
import SingleChip from '@/components/Chip';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useTreatment } from '@/context/TreatmentProvider'
import { supabase } from '@/services/supabase';
import { useAuth } from '@/context/Authprovider';

export default function TabFourScreen() {
  const { schedulePushNotification, cancelAllNotifications } = usePushNotifications();
  const { supaTreatment, setSupaTreatment } = useTreatment();
  const { supaUser } = useAuth();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [daysState, setDaysState] = useState<any[]>([])
  const [hoursState, setHoursState] = useState<any[]>([])

  useEffect(() => {
    if(supaTreatment===null) return;
    setDaysState(supaTreatment.days);
    setHoursState(supaTreatment.hours);
  }, [])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const onDismiss = () => {
    hideDatePicker();
  }

  const onConfirm = ({ hours, minutes }) => {
      setDatePickerVisibility(false);
      if(hours == 0) hours = "00";
      if(minutes < 10) minutes = `0${minutes}`;
      if(minutes == 0) minutes = "00";
      const hora = `${hours}:${minutes}`;
      const nuevoArreglo = [...hoursState, hora]

      const indice = hoursState.indexOf(hora);

      if (indice !== -1) return;

      setHoursState(nuevoArreglo);

      console.log("supaTreatment: ", supaTreatment);
    }

  const handleDayPick = (day: any) => {
    let numeroDia;

    switch (day.toLowerCase()) {
      case 'domingo':
        numeroDia = 1;
        break;
      case 'lunes':
        numeroDia = 2;
        break;
      case 'martes':
        numeroDia = 3;
        break;
      case 'miércoles':
        numeroDia = 4;
        break;
      case 'jueves':
        numeroDia = 5;
        break;
      case 'viernes':
        numeroDia = 6;
        break;
      case 'sábado':
        numeroDia = 7;
        break;
      default:
        // Manejo de caso por si el día no coincide con ninguno de los anteriores
        console.log('Día no válido');
        numeroDia = -1; // Puedes ajustar este valor según tu lógica
    }

    const indice = daysState.indexOf(numeroDia);

    if (indice !== -1) {
      const nuevoArreglo = [...daysState];
      nuevoArreglo.splice(indice, 1);
      console.log(nuevoArreglo);
      setDaysState(nuevoArreglo);
    } else {
      const nuevoArreglo = [...daysState, numeroDia];
      console.log(nuevoArreglo);
      setDaysState(nuevoArreglo);    
    }
    
  }

  const handleAssignTreatment = async() => {
    if( daysState.length === 0 || hoursState.length === 0){
      Alert.alert("Por favor introduzca mínimo 1 día y 1 hora");
      return;
    }

    cancelAllNotifications();
    if(supaTreatment === null){
      setSupaTreatment({
        days: daysState,
        hours: hoursState,
      })

      const { data, error } = await supabase
        .from('treatment')
        .insert([
          { treatment: {days: daysState, hours: hoursState}, fk_user_id: supaUser?.id },
        ])
        .select()

        Alert.alert("¡Tratamiento Asignado!");
    }else{
      setSupaTreatment({
        days: daysState,
        hours: hoursState,
      })
      
      const { data, error } = await supabase
        .from('treatment')
        .update({ treatment: {days: daysState, hours: hoursState} })
        .eq('fk_user_id', supaUser?.id)
        .select()
        Alert.alert("¡Tratamiento Actualizado!");
    }

    hoursState.forEach(hour => {
      const [newHour, minute] = hour.split(':').map(Number);
      daysState.forEach(day => {
        schedulePushNotification(day, newHour, minute);
      });
    });
  }

  const handleRemoveTreatment = async() => {
    setSupaTreatment(null)
    setHoursState([]);
    setDaysState([]);

    const { error } = await supabase
      .from('treatment')
      .delete()
      .eq('fk_user_id', supaUser?.id)
        
    cancelAllNotifications();
    Alert.alert("¡Tratamiento Eliminado!");
  }

  const handleRemoveHour = (hourToRemove: any) => {
    setHoursState((prevHours) => prevHours.filter((hour) => hour !== hourToRemove));
  };

  const handleConfirm = (date: any) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  return (
    <View>
      <MontserratBoldText style={styles.treatmentTitle}>
        { supaTreatment == null ? "¡NO cuentas con tratamiento!" : "Tu tratamiento:"}
      </MontserratBoldText>
      <MontserratSemiText style={styles.daysTag}>Días:</MontserratSemiText>

      <YStack width={"100%"} alignItems="center" space="$3" $xs={{ marginVertical: 20 }}>
        <XStack space="$1" $xs={{ flexDirection: 'row'}}>
          <SwitchWithLabel size="$3" label="Lunes" handleDayPick={handleDayPick} checked={daysState.includes(2)}/>
          <SwitchWithLabel size="$3" label="Martes" handleDayPick={handleDayPick} checked={daysState.includes(3)}/>
        </XStack>
        <XStack space="$1" $xs={{ flexDirection: 'row'}}>
          <SwitchWithLabel size="$3" label="Miércoles" handleDayPick={handleDayPick} checked={daysState.includes(4)}/>
          <SwitchWithLabel size="$3" label="Jueves" handleDayPick={handleDayPick} checked={daysState.includes(5)}/>
        </XStack>
        <XStack space="$1" $xs={{ flexDirection: 'row'}}>
          <SwitchWithLabel size="$3" label="Viernes" handleDayPick={handleDayPick} checked={daysState.includes(6)}/>
          <SwitchWithLabel size="$3" label="Sábado" handleDayPick={handleDayPick} checked={daysState.includes(7)}/>
        </XStack>
        <XStack space="$1" $xs={{ flexDirection: 'row'}}>
          <SwitchWithLabel size="$3" label="Domingo" handleDayPick={handleDayPick} checked={daysState.includes(1)}/>
        </XStack>
      </YStack>

      <MontserratSemiText style={styles.hoursTag}>Horas:</MontserratSemiText>

      <View style={styles.flexView}>
        <Button onPress={showDatePicker} style={styles.hourButton} borderRadius={32} height={52}>
          <MontserratSemiText>Añadir Hora</MontserratSemiText>
        </Button>

          <TimePickerModal
            visible={isDatePickerVisible}
            onDismiss={onDismiss}
            onConfirm={onConfirm}
            hours={12}
            minutes={0}
          />
      </View>

      <View style={{ flex: 1, flexDirection: "row", gap: 4, alignItems: 'center', justifyContent: 'center', minHeight: 40}}>
        {hoursState.map((hour, index) => (
          <SingleChip key={index} hour={hour} handleRemoveHour={handleRemoveHour} />
        ))}
      </View>
      
      
      <Button onPress={handleAssignTreatment}>{ supaTreatment === null ? "Asignar " : "Actualizar " }Tratamiento</Button>
      {
        supaTreatment !== null &&
        <Button onPress={handleRemoveTreatment}>Eliminar Tratamiento</Button>
      }
      
    </View>
  )
}

const styles = StyleSheet.create({
	treatmentTitle: {
		textAlign: "center",
    marginTop: 20,
    fontSize: 20
	},
  daysTag: {
    textAlign: "center",
    marginTop: 20,
  },
  hoursTag: {
    textAlign: "center",
  },
  hourButton: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: Colors.primary,
    width: "50%",
  },
  flexView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})