import { supabase } from '@/services/supabase';
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
  } from '@react-native-google-signin/google-signin'
import { Alert } from 'react-native';
import { err } from 'react-native-svg/lib/typescript/xml';

export default function GoogleBtn() {
    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '510600913042-if8ubbprmbg8ho16p2rr3iqceosufen0.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
      });
    
    return(
        <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => {
                try {
                    await GoogleSignin.hasPlayServices();
                    const userInfo = await GoogleSignin.signIn();
                    //console.log(userInfo);
                    
                    if(userInfo.idToken){
                        const {data, error} = await supabase.auth.signInWithIdToken({
                            provider: 'google', 
                            token: userInfo.idToken,
                        })

                        
                        const { data: dataPublic, error: errPublic } = await supabase
                        .from('users')
                        .update({ name: userInfo.user.name })
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
        />
    )
        
}