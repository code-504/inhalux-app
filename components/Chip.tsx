import Colors from '@/constants/Colors';
import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

const SingleChip = ({ hour, handleRemoveHour }: { hour: string, handleRemoveHour: Dispatch<SetStateAction<any>>}) => {
  return (
      <Chip icon="cancel" style={{minHeight: 35, backgroundColor: Colors.darkGray, }} onPress={()=>handleRemoveHour(hour)}>
        <Text style={{color: Colors.lightGrey}}>{hour}</Text>
      </Chip>
  );
};

export default SingleChip;
