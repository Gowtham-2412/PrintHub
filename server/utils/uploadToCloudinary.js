import cloudinary from '../config/cloudinary.js';

const getResourceTypeFromMime = (mimeType = '') => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'raw';
};

const uploadToCloudinary = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const resourceType = getResourceTypeFromMime(file?.mimetype || '');
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        type: 'upload',
        access_mode: 'public',
        use_filename: true,
        unique_filename: true,
        filename_override: file?.originalname,
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

export default uploadToCloudinary;
