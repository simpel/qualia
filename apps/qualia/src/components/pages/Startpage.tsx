import LoginForm from '@/components/Forms/Login/Login';
import { Button } from '@/shadcn/components/ui/button';
import { Progress } from '@/shadcn/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import { Tables } from '@/types/supabase';
import { parseDictionary } from '@/utils/dictionary/dictionary';
import dictionary from '@qualia/dictionary';
import { User } from '@supabase/supabase-js';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import ButtonCard from '../ButtonCard/ButtonCard';
import CreateProfile from '../Forms/CreateProfile/CreateProfile';

export const UnAuthorizedStartPage = () => {
  return (
    <>
      <div className="container mx-auto">
        <main className="flex flex-col">
          <div className="mt-80 flex flex-1 items-start justify-start">
            <div className="w-full">
              <h1 className="font-serif text-3xl font-thin">
                {dictionary.startpage_title}
              </h1>

              <div className="mt-2 max-w-md">
                <LoginForm>
                  <p className="text-xl text-gray-400">
                    {dictionary.startpage_subtitle}
                  </p>
                </LoginForm>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

interface IAuthorizedPage {
  user: User;
  profile: Tables<'profiles'>;
}

const assigments = [
  {
    id: 1,
    assignment: 'Assignment 1',
    description:
      'This is the first assignment This is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignment',
    class: 'Math',
    current_fulfillment: 35,
    assigned_at: '2022-01-01',
    deadline_at: '2022-01-01',
  },
  {
    id: 1,
    assignment: 'Assignment 2',
    description:
      'This is the first assignment This is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignment',
    class: 'Math',
    current_fulfillment: 99,
    assigned_at: '2022-01-01',
    deadline_at: '2022-01-01',
  },
  {
    id: 1,
    assignment: 'Assignment 3',
    description:
      'This is the first assignment This is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignmentThis is the first assignment',
    class: 'Math',
    current_fulfillment: 100,
    assigned_at: '2022-01-01',
    deadline_at: '2022-01-01',
  },
];

export const AuthorizedStartPage = ({ profile }: IAuthorizedPage) => {
  return (
    <div className="container mx-auto mt-24">
      <main className="flex flex-col gap-16">
        <h1 className=" font-serif text-5xl font-thin">
          {parseDictionary(dictionary.dashboard_segments_title, {
            name: profile.first_name,
          })}
        </h1>
        <div className="flex flex-col gap-12">
          <div className="flex gap-8 rounded-xl bg-slate-100 p-8">
            <ButtonCard
              link={{
                href: '',
              }}
            >
              Create new assignment
            </ButtonCard>

            <ButtonCard
              link={{
                href: '',
              }}
            >
              See class trends
            </ButtonCard>

            <ButtonCard
              link={{
                href: '/classes',
              }}
            >
              Manage your classes
            </ButtonCard>
          </div>
          <div className="flex flex-col gap-8">
            <h2 className=" font-serif text-4xl font-thin">
              {dictionary.dashboard_segments_assignments_title}
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead className="max-w-64">Description</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Current fulfillment</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assigments.map((assignment) => (
                  <TableRow key={assignment.assignment}>
                    <TableCell className="align-top font-medium">
                      <Button asChild>
                        <Link href={`/assignments/${assignment.id}`}>
                          {assignment.assignment}
                          <MoveRight className="ml-2" />
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell className="max-w-64 hyphens-auto align-top">
                      {assignment.description}
                    </TableCell>
                    <TableCell className="align-top">
                      {assignment.class}
                    </TableCell>
                    <TableCell className="align-top">
                      <Progress value={assignment.current_fulfillment} />
                    </TableCell>
                    <TableCell className="align-top">
                      {assignment.assigned_at}
                    </TableCell>
                    <TableCell className="align-top">
                      {assignment.deadline_at}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

interface ICreateProfilePage {
  user: User;
}

export const CreateProfileStartPage = ({ user }: ICreateProfilePage) => {
  return (
    <div className="container mx-auto mt-24">
      <div className="w-full">
        <h1 className="font-serif text-3xl font-thin">
          {dictionary.startpage_title}
        </h1>

        <div className="my-3 max-w-md">
          <CreateProfile email={user.email} />
        </div>
      </div>
    </div>
  );
};
