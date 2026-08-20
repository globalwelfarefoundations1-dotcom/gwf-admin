export interface Profile {
  id?: string;
  firstName?: string | null;
  fullName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  mobileNumber?: string | null;
  status?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  [key: string]: unknown;
}