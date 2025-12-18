export interface UserDto {
  id: string;
  email: string;
  userName: string;
  role: string;
  isActive: boolean;
}

export type UserRole = "Admin" | "User" | "Reviewer";
