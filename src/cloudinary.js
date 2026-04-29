// Update CLOUD_NAME after creating your Cloudinary account at cloudinary.com
export const CLOUD_NAME = 'dlbspj7vu';

export const cldUrl = (publicId, width) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/${publicId}`;
