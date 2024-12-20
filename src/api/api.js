import axios from 'axios';

const BASE_URL = 'https://api.whitepaperiq.com'; // Replace with your actual API base URL

export const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(`${BASE_URL}/upload-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error('Failed to upload and analyze PDF:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error uploading and analyzing PDF:', error);
      return null;
    }
  };

export const chat = async (userMessage) => {
  try {
    const response = await axios.post(`${BASE_URL}/chat`, {
      user_message: userMessage,
      user_id: sessionStorage.getItem("token"),
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to chat with GPT:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error chatting with GPT:', error);
    return null;
  }
};