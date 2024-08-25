import { AddStudentsDialog } from '@/components/AddStudentsDialog/AddStudentsDialog';
import { RemoveUserDialog } from '@/components/RemoveUserDialog/RemoveUserDialog';
import { Button } from '@/shadcn/components/ui/button';
import { Label } from '@/shadcn/components/ui/label';
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
import { redirect } from 'next/navigation';

interface IClassesPage {
  params: {
    id: number;
  };
  searchParams: Record<string, string>;
}

export default async function ClassesPage({ params }: IClassesPage) {
  if (params.id === null) redirect('/classes');

  const { profile, user } = await getProfile();
  const supabase = createClient();

  const { data: currentClass } = await supabase
    .from('classes')
    .select(
      `
      *,
      classes_users (
        *,
        profiles (first_name, last_name, id, email)
      )
      `,
    )
    .eq('id', params.id)
    .single();

  if (currentClass === null) redirect('/classes');

  return (
    <div className="container mx-auto">
      <main className="mt-8 flex flex-col gap-8">
        <h2 className="font-serif text-4xl font-thin">{currentClass.name}</h2>

        <div className="flex gap-8 rounded-xl bg-gray-100 p-6">
          <div>
            <Label className="font-bold" htmlFor="class_size">
              {dictionary['classes_class_member_count']}
            </Label>
            <p id="class_size">{currentClass?.classes_users.length}</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="created_at">
              {dictionary.created_at}
            </Label>
            <p id="created_at">
              {new Date(currentClass.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="updated_at">
              {dictionary.updated_at}
            </Label>
            <p id="updated_at">
              {currentClass.updated_at
                ? new Date(currentClass.updated_at).toLocaleString()
                : '-'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h2 className=" font-serif text-4xl font-thin">
            {dictionary.students}
          </h2>
          <AddStudentsDialog classId={currentClass.id}>
            <Button>{dictionary.add_students}</Button>
          </AddStudentsDialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dictionary.name}</TableHead>
              <TableHead>{dictionary.email}</TableHead>
              <TableHead>{dictionary.added}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentClass.classes_users.map((student) => {
              if (student.profiles === null) return null;

              return (
                <TableRow key={student.profiles?.id}>
                  <TableCell>
                    {student.profiles.first_name} {student.profiles.last_name}
                  </TableCell>
                  <TableCell>{student.profiles.email}</TableCell>
                  <TableCell>
                    {new Date(student.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="align-center">
                    <div className="flex justify-end gap-4">
                      <RemoveUserDialog
                        currentClass={currentClass}
                        profile={student.profiles}
                      >
                        <Button variant="secondary">
                          {dictionary.remove_student}
                        </Button>
                      </RemoveUserDialog>
                      <Button asChild>
                        <Link href={`/profiles/${student.id}`}>
                          {dictionary.profile_view}
                          <MoveRight className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
