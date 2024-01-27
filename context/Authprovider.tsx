import React, { Dispatch, SetStateAction } from "react";
import { useContext, useEffect, useState, createContext } from "react";
import { Session } from "@supabase/supabase-js";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import { supabase } from "@/services/supabase";
import { Avatar } from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserData } from "@/api/user";
import { useUserStore } from "@/stores/user";
import { shallow } from "zustand/shallow";

interface Props {
    children?: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
    const segments = useSegments();
    const router = useRouter();

    const {
        data,
        isLoading: userIsLoading,
        isSuccess,
        refetch,
    } = useUserData();

    const [
        authInitialized,
        session,
        setSupaUser,
        setIsLoading,
        setSession,
        setAuthInitialized,
    ] = useUserStore(
        (state) => [
            state.authInitialized,
            state.session,
            state.setSupaUser,
            state.setIsLoading,
            state.setSession,
            state.setAuthInitialized,
        ],
        shallow
    );

    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (!navigationState?.key || !authInitialized) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (
            // If the user is not signed in and the initial segment is not anything in the auth group.
            !session?.user &&
            !inAuthGroup
        ) {
            router.replace("/(auth)/login");
        } else if (session?.user && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace("/(tabs)/device"); // to tabs
        }
    }, [session, segments, authInitialized, navigationState?.key]);

    useEffect(() => {
        if (authInitialized) {
            setIsLoading(false);
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setAuthInitialized(true);
            refetch();
            setIsLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setAuthInitialized(true);
                setIsLoading(false);

                if (_event == "TOKEN_REFRESHED") {
                    //Handle Accordinngly
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe(); //.unsuscribe() added
        };
    }, []);

    useEffect(() => {
        setSupaUser(data || null);
    }, [data]);

    return children;
}