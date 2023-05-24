import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  REACT_APP_CLOUDINARY_CLOUD_LOGO,
} from "../app/config";
import axios from "axios";

export const cloudinaryUpload = async (images) => {
  if (!images || images.length === 0) return [];
  try {
    const imageUrls = [];
    for (const image of images) {
      const formData = new FormData();

      // Create a canvas to add the watermark
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Load the original image
      const imageObj = new Image();
      imageObj.src = URL.createObjectURL(image);

      // Wait for the image to load
      await new Promise((resolve) => {
        imageObj.onload = resolve;
      });

      // Set the canvas dimensions to match the image
      canvas.width = imageObj.width;
      canvas.height = imageObj.height;

      // Draw the original image on the canvas
      context.drawImage(imageObj, 0, 0);

      // Load the watermark image through the server-side proxy
      const watermarkUrl = REACT_APP_CLOUDINARY_CLOUD_LOGO;
      const watermarkObj = new Image();
      watermarkObj.crossOrigin = "anonymous"; // Allow cross-origin access
      watermarkObj.src = watermarkUrl;

      // Wait for the watermark image to load
      await new Promise((resolve) => {
        watermarkObj.onload = resolve;
      });

      // Calculate the watermark size relative to the base image size
      const watermarkWidth = imageObj.width / 5;
      const watermarkHeight =
        (watermarkWidth / watermarkObj.width) * watermarkObj.height;

      // Position the watermark on the bottom right corner of the image
      const watermarkX = canvas.width - watermarkWidth - 10;
      const watermarkY = canvas.height - watermarkHeight - 10;

      // Draw the watermark on the canvas
      context.drawImage(
        watermarkObj,
        watermarkX,
        watermarkY,
        watermarkWidth,
        watermarkHeight
      );

      // Convert the canvas content to a Blob for upload
      const toBlobPromise = new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 1); // Specify the output format and quality
      });

      const blob = await toBlobPromise;

      formData.append("file", blob);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await axios({
        url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("cloudinaryUpload", response.data);

      const imageUrl = response.data.secure_url;
      imageUrls.push(imageUrl);
    }

    console.log("cloudinaryUpload2", imageUrls);
    return imageUrls;
  } catch (error) {
    throw error;
  }
};
