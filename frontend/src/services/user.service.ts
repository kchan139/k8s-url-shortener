import { User } from '@/types/auth';
import { Response } from '@/types/response';

import { axios } from '../utils/custom-axios';

const API_URL = import.meta.env.VITE_API_URL;

const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  const queryString = `${API_URL}/users`;

  console.log('queryString', queryString);
  console.log(email, password, firstName, lastName);

  const res = await axios.post(queryString, {
    email,
    password,
    firstName,
    lastName,
  });

  const data: Response<User> = res.data;
  return data;
};

const getUsers = async (page: number, size: number, compact: boolean) => {
  const queryString = `${API_URL}/users?page=${page}&size=${size}&compact=${compact}&type=not_banned`;

  const res = await axios.get(queryString);

  const data: Response<any> = res.data;
  return data;
};

const getUserById = async (userId: string) => {
  const queryString = `${API_URL}/users/${userId}`;

  const res = await axios.get(queryString);

  const data: Response<User> = res.data;
  return data;
};

const updateUser = async (
  userId: string,
  firstName: string,
  lastName: string,
  roles: string[],
) => {
  const queryString = `${API_URL}/users/${userId}`;

  const res = await axios.put(queryString, {
    firstName,
    lastName,
    password: '',
    roles,
  });

  const data: Response<User> = res.data;
  return data;
};

const deleteUser = async (userId: string) => {
  const queryString = `${API_URL}/users/${userId}`;

  const res = await axios.delete(queryString);

  const data: Response<any> = res.data;
  return data;
};

const UserService = {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default UserService;
