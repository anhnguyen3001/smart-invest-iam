import {
  PasswordNotMatchException,
  SameOldNewPasswordException,
} from './user.exception';

export const validatePassword = (
  newPassword: string,
  confirmPassword: string,
  oldPassword?: string,
) => {
  if (newPassword !== confirmPassword) {
    throw new PasswordNotMatchException();
  }
  if (oldPassword && oldPassword === newPassword) {
    throw new SameOldNewPasswordException();
  }
};
