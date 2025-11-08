import axiosInstance from './axiosInstance';

const extractData = (response) => response.data;

export const getCategories = async () => extractData(await axiosInstance.get('/categories'));

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return extractData(
    await axiosInstance.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
};

export const uploadEventCover = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return extractData(
    await axiosInstance.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
};

export const createReport = async (payload) => extractData(await axiosInstance.post('/reports', payload));
