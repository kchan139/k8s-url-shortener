export type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  banned: boolean;
  roles: Role[];
  isAdmin: boolean;
};

export type Role = {
  name: string;
  description: string;
  permissions: Permission[];
};

export type Permission = {
  name: string;
  description: string;
};
