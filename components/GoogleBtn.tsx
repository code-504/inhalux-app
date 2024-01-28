import Colors from '@/constants/Colors';
import { supabase } from '@/services/supabase';
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
  } from '@react-native-google-signin/google-signin'
import { StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import { Button } from 'tamagui';
import { MontserratSemiText } from './StyledText';
import GoogleIcon from "@/assets/icons/google-icon.svg"

export default function GoogleBtn() {
    const todayDate = () => {
        let fechaActual = new Date();

        let año = fechaActual.getFullYear();
        let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Se suma 1 al mes, ya que en JavaScript los meses van de 0 a 11
        let dia = fechaActual.getDate().toString().padStart(2, '0');

        let fechaFormateada = `${año}-${mes}-${dia}`;
        return fechaFormateada;
    }

    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '510600913042-if8ubbprmbg8ho16p2rr3iqceosufen0.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
      });
    
    return(
        <Button
        //size={GoogleSigninButton.Size.Wide}
        //color={GoogleSigninButton.Color.Dark}
        borderRadius={32} height={52}
        style={styles.googleBtn}
        onPress={async () => {
                try {
                    await GoogleSignin.hasPlayServices();
                    const userInfo = await GoogleSignin.signIn();
                    console.log(userInfo);
                    
                    if(userInfo.idToken){
                        const {data, error} = await supabase.auth.signInWithIdToken({
                            provider: 'google', 
                            token: userInfo.idToken,
                        })
                        
                        const today = todayDate();
                        const { data: dataPublic, error: errPublic } = await supabase
                        .from('users')
                        .update({ name: userInfo.user.name, external_provider: true, created_at: today })
                        .eq('email', userInfo.user.email)
                        .select()
                        
                    }else {throw new Error('No ID token presentado')}
                } catch (error: any) {
                    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                        Alert.alert("sign in cancelled: " + error.message);
                    } else if (error.code === statusCodes.IN_PROGRESS) {
                        Alert.alert("in progress: " + error.message);
                    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                        Alert.alert("play services not available: " + error.message);
                    } else {
                        Alert.alert("else: " + error.message + "status: " + statusCodes);
                    }
                }
            }
        }
        //disabled={this.state.isSigninInProgress}
        >
            <GoogleIcon style={styles.buttonIcon} />
			<MontserratSemiText>Iniciar sesión con Google</MontserratSemiText>
        </Button>
    )
}

const styles = StyleSheet.create({
	googleBtn: {
		backgroundColor: Colors.buttonGray,
		height: 60
	},
    buttonIcon: {
		marginRight: 16
	}
})