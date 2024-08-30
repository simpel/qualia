import { IGetProfile } from '../server/profile';

type TRoles = 'admin' | 'teacher' | 'student';

const hasRole = (userRoles: IGetProfile['roles'], role: TRoles): boolean => {
  if (!userRoles) return false;

  return (
    userRoles.some((currentRole) => currentRole.role?.name === role) ?? false
  );
};

export default hasRole;
