import { Badge } from '@/shadcn/components/ui/badge';
import { Button } from '@/shadcn/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import { createClient } from '@/utils/clients/server';

import { getProfile } from '@/utils/server/profile';
import dictionary from '@qualia/dictionary';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

export default async function ClassesPage() {
  const { profile, user } = await getProfile();
  const supabase = createClient();

  const { data: profiles } = await supabase.from('profiles').select(
    `*, 
        roles:profiles_roles (
          role:roles (
            id,
            name
          )
        )
        `,
  );

  return (
    <div className="container mx-auto">
      <main className="mt-8 flex flex-col gap-8">
        <h2 className=" font-serif text-4xl font-thin">
          {dictionary.users_title}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-64">
                {dictionary.classes_class_name}
              </TableHead>
              <TableHead>{dictionary.classes_class_member_count}</TableHead>
              <TableHead>{dictionary.created_at}</TableHead>
              <TableHead>{dictionary.updated_at}</TableHead>
              <TableHead>{dictionary.profile_last_login}</TableHead>
              <TableHead>{dictionary.roles}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="align-center font-medium">
                  <Link href={`/users/${profile.id}`}>
                    {profile.first_name} {profile.last_name}
                  </Link>
                </TableCell>
                <TableCell className="align-center max-w-64 hyphens-auto">
                  {profile.email}
                </TableCell>
                <TableCell className="align-center">
                  {new Date(profile.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="align-center">
                  {profile.updated_at
                    ? new Date(profile.updated_at).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell className="align-center">
                  {profile.last_loggedin_at
                    ? new Date(profile.last_loggedin_at).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell className="align-center ">
                  <div className="flex gap-4">
                    {profile.roles.map((role) => (
                      <Badge key={role.id}>{role.role?.name}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="align-center">
                  <div className="flex justify-end gap-4">
                    <Button asChild>
                      <Link href={`/users/${profile.id}`}>
                        {dictionary.users_user_details}
                        <MoveRight className="ml-2" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
