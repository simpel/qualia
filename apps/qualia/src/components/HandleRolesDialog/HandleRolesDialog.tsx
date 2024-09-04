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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/components/ui/form';

import { handleRoles } from '@/actions/handleRoles';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { Tables } from '@/types/supabase';
import { parseDictionary } from '@/utils/dictionary/dictionary';
import { createName } from '@/utils/profle/createName/createName';
import { zodResolver } from '@hookform/resolvers/zod';
import dictionary from '@qualia/dictionary';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-multi-email/dist/style.css';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../Forms/Button/Button';

export interface IHandleRolesListItem {
  isSelected: boolean;
  roleId: Tables<'roles'>['id'];
  roleName: Tables<'roles'>['name'];
}

interface IAddUserDialog {
  profile: Tables<'profiles'>;
  roles: IHandleRolesListItem[];
  path?: string;
  children?: React.ReactNode;
}

const HandleRolesSchema = z.object({
  roles: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: dictionary.at_least_one_role,
  }),
});

export const HandleRolesDialog = ({
  profile,
  roles,
  path,
  children,
}: IAddUserDialog) => {
  const [open, setOpen] = useState(false);
  if (roles === undefined || profile === undefined) return null;

  const selectedRoles = roles
    .filter((item) => item.isSelected)
    .map((item) => item.roleId);

  const form = useForm<z.infer<typeof HandleRolesSchema>>({
    resolver: zodResolver(HandleRolesSchema),
    defaultValues: {
      roles: selectedRoles,
    },
  });

  useEffect(() => {
    console.log('ISVALID', form.formState.isValid);
  }, [form]);

  const onSubmit = async (data: z.infer<typeof HandleRolesSchema>) => {
    try {
      await handleRoles({
        path,
        profileId: profile.id,
        roles: roles.map((item) => ({
          id: item.roleId,
          isSelected: data.roles.includes(item.roleId),
        })),
      });

      toast.success(dictionary.roles_changed);

      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`An error occurred: ${error.message}`);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>{dictionary.change_roles}</DialogTitle>
            <DialogDescription>
              {parseDictionary(dictionary.change_roles_description, {
                name: createName(profile) || profile.email,
              })}
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-lg font-semibold leading-none tracking-tight">
                      {dictionary.change_roles}
                    </FormLabel>
                    <FormDescription>
                      {parseDictionary(dictionary.change_roles_description, {
                        name: createName(profile) || profile.email,
                      })}
                    </FormDescription>
                  </div>
                  {roles.map((item) => (
                    <FormField
                      key={item.roleId}
                      control={form.control}
                      name="roles"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.roleId}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.roleId)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        item.roleId,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.roleId,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.roleName}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              pending={form.formState.isSubmitting}
              pendingText={dictionary.updating_roles}
              disabled={!form.formState.isValid}
            >
              {dictionary.update_roles}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
