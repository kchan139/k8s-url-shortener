import { Permission } from '@/types/auth';
import { Response } from '@/types/response';

import { axios } from '../utils/custom-axios';
const API_URL = import.meta.env.VITE_API_URL;

const createPermission = async (name: string, description: string) => {
  const queryString = `${API_URL}/permissions`;

  const res = await axios.post(queryString, {
    name,
    description,
  });

  const data: Response<Permission> = res.data;
  return data;
};

const getPermissions = async (page: number) => {
  const queryString = `${API_URL}/permissions?page=${page}`;

  const res = await axios.get(queryString);

  const data: Response<any> = res.data;
  return data;
};

const getPermissionByName = async (name: string) => {
  const queryString = `${API_URL}/permissions/${name}`;

  const res = await axios.get(queryString);

  const data: Response<Permission> = res.data;
  return data;
};

const updatePermission = async (name: string, description: string) => {
  const queryString = `${API_URL}/permissions/${name}`;

  const res = await axios.put(queryString, {
    name,
    description,
  });

  const data: Response<Permission> = res.data;
  return data;
};

const deletePermission = async (name: string) => {
  const queryString = `${API_URL}/permissions/${name}`;
  const res = await axios.delete(queryString);

  const data: Response<any> = res.data;
  return data;
};

const PermissionService = {
  createPermission,
  getPermissions,
  getPermissionByName,
  updatePermission,
  deletePermission,
};

export default PermissionService;
