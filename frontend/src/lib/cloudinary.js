import api from './api';

export const uploadToCloudinary = async (file, resourceType = 'image') => {
  try {
    const sigResponse = await api.get(`/cloudinary/signature?resource_type=${resourceType}`);
    const { signature, timestamp, cloud_name, api_key, folder } = sigResponse.data;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`;
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    const result = await uploadResponse.json();
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};