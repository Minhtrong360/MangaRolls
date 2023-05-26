import JSZip from "jszip";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  REACT_APP_CLOUDINARY_CLOUD_LOGO,
} from "../app/config";
import axios from "axios";

export const cloudinaryUpload = async (files) => {
  if (!files || files.length === 0) return [];

  try {
    const imageUrls = [];
    const formData = new FormData();

    // Check if files is an array of images or a single file

    for (const file of files) {
      if (isImageFile(file.name)) {
        // Process individual image file
        await processImageFile(file, formData, imageUrls);
      } else {
        // Single .zip .rar file

        const zipFile = file;
        await processZipFile(zipFile, formData, imageUrls);
      }
    }

    console.log("cloudinaryUpload2", imageUrls);
    return imageUrls;
  } catch (error) {
    throw error;
  }
};

// Process individual image file
async function processImageFile(file, formData, imageUrls) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const imageObj = new Image();
  imageObj.src = URL.createObjectURL(file);

  await new Promise((resolve) => {
    imageObj.onload = resolve;
  });

  canvas.width = imageObj.width;
  canvas.height = imageObj.height;

  context.drawImage(imageObj, 0, 0);

  const watermarkUrl = REACT_APP_CLOUDINARY_CLOUD_LOGO;
  const watermarkObj = new Image();
  watermarkObj.crossOrigin = "anonymous";
  watermarkObj.src = watermarkUrl;

  await new Promise((resolve) => {
    watermarkObj.onload = resolve;
  });

  const watermarkWidth = imageObj.width / 5;
  const watermarkHeight =
    (watermarkWidth / watermarkObj.width) * watermarkObj.height;
  const watermarkX = canvas.width - watermarkWidth - 10;
  const watermarkY = canvas.height - watermarkHeight - 10;

  context.drawImage(
    watermarkObj,
    watermarkX,
    watermarkY,
    watermarkWidth,
    watermarkHeight
  );

  const toBlobPromise = new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 1);
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

// Process .zip file
async function processZipFile(zipFile, formData, imageUrls) {
  const zip = new JSZip();
  const zipData = await zip.loadAsync(zipFile);
  const zipEntries = Object.values(zipData.files); // Convert zipData into an array
  zipEntries.sort((a, b) => {
    const nameA = extractNameSubstring(a.name);
    const nameB = extractNameSubstring(b.name);
    return Number(nameA) - Number(nameB);
  });

  for (const zipEntry of zipEntries) {
    const relativePath = zipEntry.name;
    if (!zipEntry.dir && isImageFile(relativePath)) {
      const imageFile = await zipEntry.async("blob");

      await processImageFile(imageFile, formData, imageUrls);
    }
  }
}
function extractNameSubstring(name) {
  const start = name.indexOf("/") + 1;
  const end = name.indexOf(".", start);
  return name.substring(start, end);
}

// Helper function to check if a file has an image extension
function isImageFile(filename) {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const ext = filename.toLowerCase().substr(filename.lastIndexOf("."));

  return allowedExtensions.includes(ext);
}
