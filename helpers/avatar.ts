import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useUserStore } from "@/stores/user";
import { supabase } from "@/services/supabase";
import { decode } from "base64-arraybuffer";

export const handleTakePicture = async (supaUser, setSupaUser) => {
    await ImagePicker.requestCameraPermissionsAsync();

    let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
    });

    if (!result.canceled) {
        const img = result.assets[0];
        const base64 = await FileSystem.readAsStringAsync(img.uri, {
            encoding: "base64",
        });
        const filePath = `/public/${new Date().getTime()}.png`;
        const contentType = "image/png";
        console.log(result.assets[0].uri);

        if (
            supaUser?.avatar !=
            "https://ckcwfpbvhbstslprlbgr.supabase.co/storage/v1/object/public/avatars/default_avatar.png?t=2023-12-19T02%3A43%3A15.423Z"
        ) {
            const { data, error } = await supabase.storage
                .from("avatars")
                .remove([
                    `public/${supaUser?.avatar.substring(
                        supaUser?.avatar.lastIndexOf("/") + 1
                    )}`,
                ]);

            console.log("dataDelete ", data);
            console.log("errorDelete ", error);
        }

        const { data, error } = await supabase.storage
            .from("avatars")
            .upload(filePath, decode(base64), { contentType });

        console.log("data ", data);
        console.log("error ", error);

        const url = `https://ckcwfpbvhbstslprlbgr.supabase.co/storage/v1/object/public/avatars${filePath}`;
        setSupaUser({ ...supaUser, avatar: url });

        const { data: userData, error: errorData } = await supabase
            .from("users")
            .update({ avatar: url })
            .eq("id", supaUser?.id)
            .select();
    }
};

export const handleUploadPicture = async (supaUser, setSupaUser) => {
    const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
        const img = result.assets[0];
        const base64 = await FileSystem.readAsStringAsync(img.uri, {
            encoding: "base64",
        });
        const filePath = `/public/${new Date().getTime()}.png`;
        const contentType = "image/png";

        if (
            supaUser?.avatar !=
            "https://ckcwfpbvhbstslprlbgr.supabase.co/storage/v1/object/public/avatars/default_avatar.png?t=2023-12-19T02%3A43%3A15.423Z"
        ) {
            console.log(
                "avatar",
                `public/${supaUser?.avatar.substring(
                    supaUser?.avatar.lastIndexOf("/") + 1
                )}`
            );

            const { data, error } = await supabase.storage
                .from("avatars")
                .remove([
                    `public/${supaUser?.avatar.substring(
                        supaUser?.avatar.lastIndexOf("/") + 1
                    )}`,
                ]);

            console.log("dataDelete ", data);
            console.log("errorDelete ", error);
        }

        const { data, error } = await supabase.storage
            .from("avatars")
            .upload(filePath, decode(base64), { contentType });

        console.log("data ", data);
        console.log("error ", error);

        const url = `https://ckcwfpbvhbstslprlbgr.supabase.co/storage/v1/object/public/avatars${filePath}`;
        setSupaUser({ ...supaUser, avatar: url });

        const { data: userData, error: errorData } = await supabase
            .from("users")
            .update({ avatar: url })
            .eq("id", supaUser?.id)
            .select();
    }
};

export const handleErasePicture = async (supaUser, setSupaUser) => {
    setSupaUser({
        ...supaUser,
        avatar: "https://ckcwfpbvhbstslprlbgr.supabase.co/storage/v1/object/public/avatars/default_avatar.png?t=2023-12-19T02%3A43%3A15.423Z",
    });

    const { data, error } = await supabase.storage
        .from("avatars")
        .remove([
            `public/${supaUser?.avatar.substring(
                supaUser?.avatar.lastIndexOf("/") + 1
            )}`,
        ]);

    console.log("dataDelete ", data);
    console.log("errorDelete ", error);

    const { data: userData, error: errorData } = await supabase
        .from("users")
        .update({ avatar: null })
        .eq("id", supaUser?.id)
        .select();
};
