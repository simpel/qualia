import { AddProfilesDialog } from '@/components/AddProfilesDialog/AddProfilesDialog';
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
import hasRole from '@/utils/hasRole/hasRole';
import { isAuthenticated } from '@/utils/isAuthenticated/isAuthenticated';
import { getProfile } from '@/utils/server/profile';

import dictionary from '@qualia/dictionary';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

export default async function ClassesPage() {
  const supabase = createClient();
  await isAuthenticated();
  const { roles } = await getProfile();

  const isTeacher = hasRole(roles, 'teacher');

  const classes = await supabase.from('classes').select(`
    *,
    profiles_classes (*)
    `);

  const { data: studentRoles } = await supabase
    .from('roles')
    .select('*')
    .eq('name', 'student');

  return (
    <div className="container mx-auto">
      <main className="mt-8 flex flex-col gap-8">
        <h2 className=" font-serif text-4xl font-thin">
          {dictionary.your_classes}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-64">{dictionary.name}</TableHead>
              <TableHead>{dictionary.number_of_students}</TableHead>
              <TableHead>{dictionary.created_at}</TableHead>
              <TableHead>{dictionary.updated_at}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.data?.map((currentClass) => (
              <TableRow key={currentClass.id}>
                <TableCell className="align-center font-medium">
                  <Link href={`/classes/${currentClass.id}`}>
                    {currentClass.name}
                  </Link>
                </TableCell>
                <TableCell className="align-center max-w-64 hyphens-auto">
                  {currentClass.profiles_classes.length}
                </TableCell>
                <TableCell className="align-center">
                  {new Date(currentClass.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="align-center">
                  {currentClass.updated_at
                    ? new Date(currentClass.updated_at).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell className="align-center">
                  <div className="flex justify-end gap-4">
                    {isTeacher && (
                      <AddProfilesDialog
                        classes={[currentClass]}
                        roles={studentRoles}
                        revalidatePath="/classes"
                      >
                        {dictionary.add_student}
                      </AddProfilesDialog>
                    )}
                    <Button asChild>
                      <Link href={`/classes/${currentClass.id}`}>
                        {dictionary.see_class_details}
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
