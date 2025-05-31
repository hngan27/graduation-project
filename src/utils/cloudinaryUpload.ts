import cloudinary from '../config/cloudinary-config';

const uploadImageToCloudinary = (filePath: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(filePath, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

export default uploadImageToCloudinary;
