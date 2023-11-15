import React from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '@/context/Authprovider'
import { MontserratText } from '@/components/StyledText';

const index = () => {
  
  const auth = useAuth();

  if (!auth.session) {
    return <Redirect href="/(auth)/login" />;
  }

  return  <Redirect href="/(tabs)/device" />;
}

export default index
