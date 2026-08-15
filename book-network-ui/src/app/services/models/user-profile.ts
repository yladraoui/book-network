
export interface UserProfile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  accountLocked?: boolean;
}