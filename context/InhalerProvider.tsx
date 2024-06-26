import React, { Dispatch, SetStateAction } from "react";
import { useContext, useEffect, useState, createContext } from "react";
import { supabase } from "@/services/supabase";
import { WeatherAPI, WeatherData } from "@/interfaces/Device";
import axios from "axios";
import publicIP from "react-native-public-ip";
import * as Location from "expo-location";
import { useUserStore } from "@/stores/user";

interface Props {
    children?: React.ReactNode;
}

export interface inhalerProps {
    id: string;
    title: string;
    battery: string;
    dosis: string;
    connection: string;
    latitude: string;
    altitude: string;
    longitude: string;
    address: string;
}

export interface InhalerContextType {
    supaInhalers: any[] | null;
    setSupaInhalers: Dispatch<SetStateAction<any[]>>;
    fetchSupaInhalerById: (id: string) => Promise<inhalerProps | null>;
    weatherData: WeatherData | undefined;
}

export const InhalerContext = createContext<InhalerContextType | undefined>(
    undefined
);

export function InhalerProvider({ children }: Props) {
    const [supaInhalers, setSupaInhalers] = useState<any[]>([]);
    const [weatherData, setWeatherData] = useState<WeatherData>();
    const { session } = useUserStore();

    const calculateDaysAgo = (lastSeen: string): string => {
        const today = new Date();
        const lastSeenDate = new Date(lastSeen);
        const differenceInMilliseconds =
            today.getTime() - lastSeenDate.getTime();
        const differenceInDays = Math.floor(
            differenceInMilliseconds / (1000 * 60 * 60 * 24)
        );

        if (differenceInDays === -1) return "un momento";
        else return `${differenceInDays} días`;
    };

    const fetchSupaInhalers = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: inhalersData, error: inhalersError } = await supabase
            .from("inhalers")
            .select(
                `
              id, 
              name,
              inhaler_state ( dosis, battery ),
              inhaler_ubication ( latitude, longitude, altitude, last_seen, address )
              `
            )
            .eq("fk_user_id", user.id)
            .order("name", { ascending: true });

        if (inhalersData) {
            const transformedData = inhalersData.map((inhaler: any) => ({
                id: inhaler.id,
                title: inhaler.name,
                connection: `Hace ${calculateDaysAgo(
                    inhaler.inhaler_ubication.last_seen
                )}`,
                battery: inhaler.inhaler_state.battery,
                dosis: inhaler.inhaler_state.dosis,
                altitude: inhaler.inhaler_ubication.altitude,
                longitude: inhaler.inhaler_ubication.longitude,
                latitude: inhaler.inhaler_ubication.latitude,
                address: inhaler.inhaler_ubication.address,
            }));
            setSupaInhalers(transformedData);
            //console.log("inhalersData", inhalersData);
            //console.log("transformedData", transformedData);
        }
    };

    const fetchSupaInhalerById = async (
        id: string
    ): Promise<inhalerProps | null> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return null;

        const { data: inhalersData, error: inhalersError } = await supabase
            .from("inhalers")
            .select(
                `
        id, 
        name,
        inhaler_state ( dosis, battery ),
        inhaler_ubication ( latitude, longitude, altitude, last_seen, address)
      `
            )
            .eq("fk_user_id", user.id)
            .eq("id", id)
            .single();

        if (inhalersData) {
            const transformedData: inhalerProps = {
                id: String(inhalersData.id),
                title: String(inhalersData.name),
                connection: String(
                    `Hace ${calculateDaysAgo(
                        inhalersData.inhaler_ubication.last_seen
                    )}`
                ),
                battery: String(inhalersData.inhaler_state.battery),
                dosis: String(inhalersData.inhaler_state.dosis),
                latitude: String(inhalersData.inhaler_ubication.latitude),
            };

            //console.log(transformedData)
            return transformedData;
        }

        return null;
    };

    const fetchWeatherData = async () => {
        try {
            const ip = await publicIP();

            if (!ip) return;

            const apiData = await axios.get<WeatherAPI>(
                `https://api.weatherapi.com/v1/current.json?key=0da3a00c4b724f50880205522232112&q=${ip}&aqi=yes`
            );

            setWeatherData({
                location: `${apiData.data.location.name}, ${apiData.data.location.country}`,
                temp: apiData.data.current.temp_c,
                hum: apiData.data.current.humidity,
                ...apiData.data.current.air_quality,
                aq: apiData.data.current.air_quality["us-epa-index"],
            });
        } catch (error) {
            //console.log(error)
        }
    };

    useEffect(() => {
        fetchSupaInhalers();
        fetchWeatherData();
    }, [session]);

    return (
        <InhalerContext.Provider
            value={{
                supaInhalers,
                setSupaInhalers,
                fetchSupaInhalerById,
                weatherData,
            }}
        >
            {children}
        </InhalerContext.Provider>
    );
}

export const useInhalers = () => {
    const context = useContext(InhalerContext);
    if (context === undefined) {
        throw new Error(
            `useInhaler must be used within a MyUserContextProvider.`
        );
    }
    return context;
};
