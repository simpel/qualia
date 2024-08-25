import { AddStudentsDialog } from '@/components/AddStudentsDialog/AddStudentsDialog';
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

  const { data: classes } = await supabase.from('classes').select(`
		*,
    classes_users (
      id
    )
		`);

  return (
    <div className="container mx-auto">
      <main className="mt-8 flex flex-col gap-8">
        <h2 className=" font-serif text-4xl font-thin">
          {dictionary.classes_title}
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes?.map((currentClass) => (
              <TableRow key={currentClass.id}>
                <TableCell className="align-center font-medium">
                  <Link href={`/classes/${currentClass.id}`}>
                    {currentClass.name}
                  </Link>
                </TableCell>
                <TableCell className="align-center max-w-64 hyphens-auto">
                  {currentClass.classes_users.length}
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
                    <AddStudentsDialog classId={currentClass.id}>
                      <Button variant="secondary">
                        {dictionary.add_students}
                      </Button>
                    </AddStudentsDialog>
                    <Button asChild>
                      <Link href={`/classes/${currentClass.id}`}>
                        {dictionary.classes_class_details}
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
