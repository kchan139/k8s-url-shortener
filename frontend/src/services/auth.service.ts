import { User } from '@/types/auth';
import { Response } from '@/types/response';

import { axios } from '../utils/custom-axios';

const API_URL = import.meta.env.VITE_API_URL;

const loginByEmail = async (email: string, password: string) => {
  const queryString = `${API_URL}/auth/token`;

  const res = await axios.post(queryString, {
    email,
    password,
  });

  const data: Response<{ token: string }> = res.data;
  return data;
};

const revokeToken = async (token: string) => {
  const queryString = `${API_URL}/auth/revoke`;

  const res = await axios.post(queryString, {
    token,
  });

  const data: Response<{ token: string }> = res.data;
  return data;
};

const refreshToken = async (refreshToken: string) => {
  const queryString = `${API_URL}/auth/refresh`;

  const res = await axios.post(queryString, {
    refreshToken,
  });

  const data: Response<{ token: string }> = res.data;
  return data;
};

const introspectToken = async (token: string) => {
  const queryString = `${API_URL}/auth/introspect`;

  const res = await axios.post(queryString, {
    token,
  });

  const data: Response<{ active: boolean }> = res.data;
  return data;
};

const getMe = async () => {
  const queryString = `${API_URL}/auth/me`;

  const res = await axios.get(queryString);

  const data: Response<User> = res.data;
  return data;
};

const AuthService = {
  loginByEmail,
  revokeToken,
  refreshToken,
  introspectToken,
  getMe,
};

export default AuthService;
