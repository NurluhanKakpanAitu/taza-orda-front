import axiosInstance from './axiosInstance';

const extractData = (response) => response.data;

export const login = async (payload) => extractData(await axiosInstance.post('/Auth/login', payload));

export const register = async (payload) => extractData(await axiosInstance.post('/Auth/register', payload));

export const getProfile = async () => extractData(await axiosInstance.get('/users/me'));

export const logout = async () => extractData(await axiosInstance.post('/Auth/logout'));
