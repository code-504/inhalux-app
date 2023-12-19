import { supabase } from "@/services/supabase";
import { decode } from "base64-arraybuffer";
import { nanoid } from "nanoid";

const uploadToSupabase = async (
	base64Image: string,
	imageExtension = "jpg",
	bucketName = "avatars"
): Promise<void> => {
	try {
		const base64Str = base64Image.includes("base64,")
			? base64Image.substring(
					base64Image.indexOf("base64,") + "base64,".length
			  )
			: base64Image;
		const res = decode(base64Str);

		if (!(res.byteLength > 0)) {
			console.error("[uploadToSupabase] ArrayBuffer is null");
			return;
		}

		const { data, error } = await supabase.storage
			.from(bucketName)
			.upload(`${nanoid()}.${imageExtension}`, res, {
				contentType: `image/${imageExtension}`,
			});
		if (!data) {
			console.error("[uploadToSupabase] Data is null");
			return;
		}

        console.log("uploadData ", data);
        console.log("errorData ", error);

	} catch (err: any) {
		console.error("error: ", err.message);
		return;
	}
};

export default uploadToSupabase;