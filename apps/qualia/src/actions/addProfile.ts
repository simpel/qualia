'use server';

import { IStatus } from '@/types/generic';
import { createClient } from '@/utils/clients/server';
import { parseDictionary } from '@/utils/dictionary/dictionary';
import { isAuthenticated } from '@/utils/isAuthenticated/isAuthenticated';
import { createName } from '@/utils/profle/createName/createName';
import dictionary from '@qualia/dictionary';
import { Message, sha256 } from 'js-sha256';
import { revalidatePath } from 'next/cache';

export interface IAddProfile {
  emails: string[];
  roleId: number;
  classId?: number;
  className?: string;
  path?: string;
}

export async function addProfile({
  emails,
  roleId,
  classId,
  className,
  path,
}: IAddProfile): Promise<IStatus[]> {
  const supabase = createClient();
  await isAuthenticated();

  const statusMessages: IStatus[] = [];

  try {
    const profilePromises = emails.map(async (email) => {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('email', email)
        .single();

      if (profileError) {
        const { data: newProfileData, error: newProfileError } = await supabase
          .from('profiles')
          .insert({ email, gravatar: sha256(email as Message) })
          .select();

        if (newProfileError) {
          statusMessages.push({
            status: 'error',
            message: parseDictionary(dictionary.create_profile_error, {
              name: email,
            }),
          });
          return null;
        }

        statusMessages.push({
          status: 'success',
          message: parseDictionary(dictionary.profile_created_for, {
            name: createName(newProfileData[0]) || email,
          }),
        });

        return newProfileData[0];
      } else {
        statusMessages.push({
          status: 'info',
          message: parseDictionary(dictionary.profile_already_exists_for, {
            name: createName(profileData) || profileData.email,
          }),
        });
        return profileData;
      }
    });

    const profiles = await Promise.all(profilePromises);
    const currentRole = (
      await supabase.from('roles').select('*').eq('id', roleId).single()
    ).data;

    for (const profile of profiles) {
      if (!profile) continue;

      // Step 2: Update the profiles_roles table if roleId is provided
      if (roleId) {
        // Check if the role already exists for the profile
        const { data: existingRoleData, error: existingRoleError } =
          await supabase
            .from('profiles_roles')
            .select('id')
            .eq('profile_id', profile.id)
            .eq('role_id', roleId)
            .select();

        if (existingRoleData && existingRoleData.length > 0) {
          statusMessages.push({
            status: 'info',
            message: parseDictionary(dictionary.role_already_added, {
              name: createName(profile) || profile.email,
              role: currentRole !== null ? currentRole.name : '',
            }),
          });
        } else if (existingRoleError) {
          statusMessages.push({
            status: 'error',
            message: parseDictionary(dictionary.checking_existing_roles_error, {
              name: createName(profile) || profile.email,
            }),
          });
          continue;
        } else {
          const { data: roleData, error: roleError } = await supabase
            .from('profiles_roles')
            .upsert({ profile_id: profile.id, role_id: roleId });

          if (roleError) {
            statusMessages.push({
              status: 'error',
              message: parseDictionary(dictionary.updating_roles_error, {
                name: createName(profile) || profile.email,
              }),
            });
            continue;
          }

          statusMessages.push({
            status: 'success',
            message: parseDictionary(dictionary.updated_profile_role, {
              name: createName(profile) || profile.email,
              role: currentRole !== null ? currentRole.name : '',
            }),
          });
        }
      }

      // Step 3: Update the profiles_classes table if classId is provided
      // Step 3: Update the profiles_classes table if classId is provided
      if (roleId === 3) {
        if (!classId) {
          statusMessages.push({
            status: 'error',
            message: dictionary.generic_error,
          });
          continue;
        }

        // Check if the profile is already in the class
        const { data: existingClassData, error: existingClassError } =
          await supabase
            .from('profiles_classes')
            .select('id')
            .eq('profile_id', profile.id)
            .eq('class_id', classId)
            .single();

        if (existingClassData) {
          statusMessages.push({
            status: 'info',
            message: parseDictionary(dictionary.profile_already_in_class, {
              name: createName(profile) || profile.email,
              class: className || '',
            }),
          });
        } else {
          const { error: classError } = await supabase
            .from('profiles_classes')
            .upsert({ profile_id: profile.id, class_id: classId });

          if (classError) {
            statusMessages.push({
              status: 'error',
              message: parseDictionary(
                dictionary.profile_could_not_be_added_to_class,
                {
                  name: createName(profile) || profile.email,
                  class: className || '',
                },
              ),
            });
            continue;
          }

          statusMessages.push({
            status: 'success',
            message: parseDictionary(dictionary.profile_added_to_class, {
              name: createName(profile) || profile.email,
              class: className || '',
            }),
          });
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      statusMessages.push({
        status: 'error',
        message: dictionary.generic_error,
      });
    }
  }

  if (path) revalidatePath(path);

  return statusMessages;
}
