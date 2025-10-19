import { Role } from '@/types/auth';
import { Response } from '@/types/response';

import { axios } from '../utils/custom-axios';
const API_URL = import.meta.env.VITE_API_URL;

const createRole = async (
  name: string,
  description: string,
  permissions: string[],
) => {
  const queryString = `${API_URL}/roles`;

  const res = await axios.post(queryString, {
    name,
    description,
    permissions,
  });

  const data: Response<Role> = res.data;
  return data;
};

const getRoles = async (page: number, compact: boolean = false) => {
  const queryString = `${API_URL}/roles?page=${page}&compact=${compact}`;

  const res = await axios.get(queryString);

  const data: Response<any> = res.data;
  return data;
};

const getRoleByName = async (name: string) => {
  const queryString = `${API_URL}/roles/${name}`;

  const res = await axios.get(queryString);

  const data: Response<any> = res.data;
  return data;
};

const updateRole = async (
  name: string,
  description: string,
  permissions: string[],
) => {
  const queryString = `${API_URL}/roles/${name}`;

  const res = await axios.put(queryString, {
    name,
    description,
    permissions,
  });

  const data: Response<Role> = res.data;
  return data;
};

const deleteRole = async (name: string) => {
  const queryString = `${API_URL}/roles/${name}`;
  const res = await axios.delete(queryString);

  const data: Response<any> = res.data;
  return data;
};

const RoleService = {
  createRole,
  getRoles,
  getRoleByName,
  updateRole,
  deleteRole,
};

export default RoleService;
