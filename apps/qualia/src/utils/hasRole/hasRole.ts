import { IGetProfile } from '../server/profile';

type TRoles = 'admin' | 'teacher' | 'student';

const hasRole = (roles: IGetProfile['roles'], role: TRoles): boolean => {
  return roles?.some((currentRole) => currentRole.role?.name === role) ?? false;
};

export default hasRole;
