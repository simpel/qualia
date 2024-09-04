'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/components/ui/form';

import { addProfile } from '@/actions/addProfile';
import { Input } from '@/shadcn/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';
import { Tables } from '@/types/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import dictionary from '@qualia/dictionary';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import 'react-multi-email/dist/style.css';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../Forms/Button/Button';

interface IAddUserDialog {
  classes?: Tables<'classes'>[] | null;
  roles: Tables<'roles'>[] | null;
  revalidatePath?: string;
  children?: React.ReactNode;
}

const AddProfilesSchema = z
  .object({
    email: z
      .string({
        required_error: 'Please enter a valid email.',
      })
      .email(),
    roleId: z.string({
      required_error: 'Please select a role.',
    }),
    classId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate classId if roleId is '3'
    if (data.roleId === '3' && !data.classId) {
      ctx.addIssue({
        path: ['classId'],
        code: 'custom',
        message: 'You must select a class if the role is Student.',
      });
    }
  });

export const AddProfilesDialog = ({
  classes,
  roles,
  revalidatePath,
  children,
}: IAddUserDialog) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof AddProfilesSchema>>({
    resolver: zodResolver(AddProfilesSchema),
    defaultValues: {
      roleId: roles?.length === 1 ? String(roles[0]?.id) : '',
      classId:
        roles?.length === 1 && roles[0]?.id !== 3
          ? ''
          : classes?.length === 1
            ? String(classes[0]?.id)
            : '',
    },
  });

  const selectedRoleId = useWatch({ control: form.control, name: 'roleId' });

  const onSubmit = async (data: z.infer<typeof AddProfilesSchema>) => {
    try {
      const currentClass = classes?.find(
        (currentClass) => currentClass.id === Number(data.classId),
      );

      const response = await addProfile({
        emails: [data.email],
        roleId: Number(data.roleId),
        classId: Number(data.classId),
        className: currentClass?.name,
        path: revalidatePath,
      });

      response.forEach((status) => {
        //@ts-ignore
        toast[status.status](status.message);
      });

      setOpen(false);
    } catch (error) {
      if (error instanceof Error)
        toast.error(`An error occurred: ${error.message}`);
    }
  };

  if (roles === undefined) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.add_students}</DialogTitle>
          <DialogDescription>
            {dictionary.class_add_students_descriptions}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.email}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={dictionary.email}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Render role selection or display input if there's only one role */}
            {roles && roles.length > 0 && (
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {roles.length === 1
                        ? dictionary.selected_role
                        : dictionary.select_a_role}
                    </FormLabel>

                    <FormControl>
                      {roles.length === 1 ? (
                        <Input
                          type="text"
                          value={roles[0]?.name}
                          disabled
                          readOnly
                        />
                      ) : (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value !== '3') {
                              form.setValue('classId', ''); // Reset classId when the role is not 'Student'
                              form.trigger('classId'); // Trigger validation to update form state
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={dictionary.select_a_role}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((currentRole) => (
                              <SelectItem
                                key={currentRole.id}
                                value={String(currentRole.id)}
                              >
                                {currentRole.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* Render class selection or display input if there's only one class */}
            {selectedRoleId === '3' && classes && classes.length > 0 && (
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {classes.length === 1
                        ? dictionary.selected_class
                        : dictionary.select_a_class}
                    </FormLabel>

                    <FormControl>
                      {classes.length === 1 ? (
                        <Input
                          type="text"
                          value={classes[0]?.name}
                          disabled
                          readOnly
                        />
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={dictionary.select_a_class}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((currentClass) => (
                              <SelectItem
                                key={currentClass.id}
                                value={String(currentClass.id)}
                              >
                                {currentClass.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              pending={form.formState.isSubmitting}
              pendingText={dictionary.adding_students}
              disabled={!form.formState.isValid}
            >
              {dictionary.add_students}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
