import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Button, Input } from 'tamagui'
import { MontserratText } from '@/components/StyledText'
import { Stack } from 'expo-router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
            <Input
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
        </View>
        <View style={styles.verticallySpaced}>
            <Input
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
            />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button disabled={loading} onPress={() => signInWithEmail()}><MontserratText>Iniciar sesión</MontserratText></Button>
        </View>
        <View style={styles.verticallySpaced}>
            <Button disabled={loading} onPress={() => signUpWithEmail()}><MontserratText>registrarse</MontserratText></Button>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})