import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadPdfToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      format: "pdf",
      folder: "soil-reports",
      type: "authenticated", 
    });

    return result;
  } finally {
    // Always delete file, even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
