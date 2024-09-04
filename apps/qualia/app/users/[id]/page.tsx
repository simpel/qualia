import {
  HandleRolesDialog,
  IHandleRolesListItem,
} from '@/components/HandleRolesDialog/HandleRolesDialog';
import { RemoveProfile } from '@/components/RemoveProfile/RemoveProfile';
import { Button } from '@/shadcn/components/ui/button';
import { Label } from '@/shadcn/components/ui/label';
import { createClient } from '@/utils/clients/server';
import hasRole from '@/utils/hasRole/hasRole';
import { isAuthenticated } from '@/utils/isAuthenticated/isAuthenticated';
import { createName } from '@/utils/profle/createName/createName';

import { getProfile } from '@/utils/server/profile';
import dictionary from '@qualia/dictionary';
import { formatDistanceToNow } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';

interface IClassesPage {
  params: {
    id: number;
  };
  searchParams: Record<string, string>;
}

export default async function ClassesPage({ params }: IClassesPage) {
  isAuthenticated();

  if (params.id === null) redirect('/classes');

  const { roles } = await getProfile();

  const isAdmin = hasRole(roles, 'admin');

  const supabase = createClient();

  const { data: allRoles } = await supabase.from('roles').select('*');

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select(
      `
      *,
      profiles_classes (      
        classes (*)
      ),
      profiles_roles (
        roles (*)
      )
      `,
    )
    .eq('id', params.id)
    .single();

  if (currentProfile === null) redirect('/users');

  const roleArray = allRoles?.map((role) => ({
    roleId: role.id,
    isSelected: roles?.some((userRole) => userRole.id === role.id),
    roleName: role.name,
  })) as IHandleRolesListItem[];

  return (
    <div className="container mx-auto">
      <main className="mt-8 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-4xl font-thin">
            {createName(currentProfile) ?? currentProfile.email}
          </h1>
          <div>
            <RemoveProfile profile={currentProfile} path="/users">
              <Button variant={'destructive'}>
                <Trash2 className="mr-2 h-4 w-4" />
                {dictionary.remove_profile}
              </Button>
            </RemoveProfile>
          </div>
        </div>

        <div className="flex gap-8 rounded-xl bg-gray-100 p-6">
          <div>
            <Label className="font-bold" htmlFor="created_at">
              {dictionary.created_at}
            </Label>
            <p id="created_at">
              {formatDistanceToNow(new Date(currentProfile.created_at), {
                addSuffix: true,
                locale: enGB,
              })}
            </p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="updated_at">
              {dictionary.updated_at}
            </Label>
            <p id="updated_at">
              {currentProfile.updated_at
                ? formatDistanceToNow(new Date(currentProfile.updated_at), {
                    addSuffix: true,
                    locale: enGB,
                  })
                : null}
            </p>
          </div>
          {isAdmin && (
            <div>
              <Label className="font-bold" htmlFor="updated_at">
                {dictionary.roles}
              </Label>
              <div className="flex gap-2">
                {currentProfile.profiles_roles.map((role, index) => {
                  if (role.roles) {
                    if (index === currentProfile.profiles_roles.length - 1) {
                      return role.roles.name;
                    } else {
                      return `${role.roles.name}, `;
                    }
                  }
                })}
              </div>
            </div>
          )}
          <div className="ml-auto">
            <HandleRolesDialog
              roles={roleArray}
              path={`/users/${currentProfile.id}`}
              profile={currentProfile}
            >
              <Button variant={'outline'} className="cursor-pointer	">
                {dictionary.change_roles}
              </Button>
            </HandleRolesDialog>
          </div>
        </div>
      </main>
    </div>
  );
}
