export interface Customer {
  id: number;
  userName: string;
  userAdd: string;
  userPhone: string;
  userEmail: string;
  status: boolean;
  createdDate: string;
  updatedDate: string | null;
}

export interface ChangePasswordDTO {
  id: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}