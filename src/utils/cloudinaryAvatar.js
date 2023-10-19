import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../app/config";
import axios from "axios";

export const cloudinaryAvatar = async (images) => {
  if (!images || images.length === 0) return [];
  try {
    const imageUrls = [];
    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const response = await axios({
        url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.secure_url;
      imageUrls.push(imageUrl);
    }

    return imageUrls;
  } catch (error) {
    throw error;
  }
};
