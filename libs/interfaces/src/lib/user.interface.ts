export interface IUser {
  id: number;
  email: string;
  password: string;
  key: string;
  telegram?: string;
  hasAccess: boolean;
  role: string;
}
