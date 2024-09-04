import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import { Badge } from '@/shadcn/components/ui/badge';
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
import { createName } from '@/utils/profle/createName/createName';
import { formatDistanceToNow } from 'date-fns';
import { enGB } from 'date-fns/locale';

import { AddProfilesDialog } from '@/components/AddProfilesDialog/AddProfilesDialog';
import { RemoveProfileFromClassDialog } from '@/components/RemoveProfileFromClassDialog/RemoveProfileFromClassDialog';
import { isAuthenticated } from '@/utils/isAuthenticated/isAuthenticated';
import dictionary from '@qualia/dictionary';
import { MoveRight, Trash2 } from 'lucide-react';
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
  const supabase = createClient();

  await isAuthenticated();

  const { data: currentClass } = await supabase
    .from('classes')
    .select(
      `
      *,
      profiles_classes (
        *,
        profiles (first_name, last_name, id, email, user_id, gravatar, last_loggedin_at)
      )
      `,
    )
    .eq('id', params.id)
    .single();

  const { data: availableRoles } = await supabase
    .from('roles')
    .select(
      `
      *
      `,
    )
    .eq('id', '3');

  console.log({ availableRoles });

  if (currentClass === null) redirect('/classes');

  return (
    <div className="container mx-auto">
      <main className="mt-8 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-4xl font-thin">{currentClass.name}</h1>
          <Button variant={'destructive'}>
            <Trash2 className="mr-2 h-4 w-4" />
            {dictionary.remove_class}
          </Button>
        </div>

        <div className="flex gap-8 rounded-xl bg-gray-100 p-6">
          <div>
            <Label className="font-bold" htmlFor="class_size">
              {dictionary['number_of_students']}
            </Label>
            <p id="class_size">{currentClass?.profiles_classes.length}</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="created_at">
              {dictionary.created_at}
            </Label>
            <p id="created_at">
              {formatDistanceToNow(new Date(currentClass.created_at), {
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
              {currentClass.updated_at
                ? formatDistanceToNow(new Date(currentClass.updated_at), {
                    addSuffix: true,
                    locale: enGB,
                  })
                : null}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h2 className=" font-serif text-4xl font-thin">
            {dictionary.students}
          </h2>
          <AddProfilesDialog
            classes={[currentClass]}
            roles={availableRoles}
            revalidatePath={`/classes/${currentClass.id}`}
          >
            <Button className="bg-green-600 hover:bg-green-700">
              {dictionary.add_student}
            </Button>
          </AddProfilesDialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dictionary.name}</TableHead>
              <TableHead>{dictionary.email}</TableHead>
              <TableHead>{dictionary.profile_last_login}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentClass.profiles_classes.map((student) => {
              if (student.profiles === null) return null;

              return (
                <TableRow key={student.profiles?.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            student.profiles.gravatar
                              ? `https://www.gravatar.com/avatar/${student.profiles.gravatar}?s=40&d=404
`
                              : undefined
                          }
                        />
                        <AvatarFallback>
                          {createName(student.profiles, true)}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/users/${student.id}`}
                        className="hover:underline"
                      >
                        {createName(student.profiles) || '-'}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{student.profiles.email}</TableCell>
                  <TableCell>
                    {student.profiles.last_loggedin_at ? (
                      formatDistanceToNow(
                        new Date(student.profiles.last_loggedin_at),
                        {
                          addSuffix: true,
                          locale: enGB,
                        },
                      )
                    ) : (
                      <Badge variant="secondary">
                        {dictionary.never_logged_in}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="align-center">
                    <div className="flex justify-end gap-4">
                      <RemoveProfileFromClassDialog
                        currentClass={currentClass}
                        profile={student.profiles}
                      >
                        <Button variant="secondary">
                          {dictionary.remove_student}
                        </Button>
                      </RemoveProfileFromClassDialog>
                      <Button asChild>
                        <Link href={`/users/${student.profiles.id}`}>
                          {dictionary.view_profile}
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
