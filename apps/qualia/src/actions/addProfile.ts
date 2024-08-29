'use server';

import { IStatus } from '@/types/generic';
import { createClient } from '@/utils/clients/server';
import { isAuthenticated } from '@/utils/isAuthenticated/isAuthenticated';
import { createName } from '@/utils/profle/createName/createName';
import { Message, sha256 } from 'js-sha256';
import { revalidatePath } from 'next/cache';

export async function addProfile(
  emails: string[],
  roleId?: number,
  classId?: number,
  path?: string,
): Promise<IStatus[]> {
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
            message: `Failed to create profile for ${email}`,
          });
          return null;
        }

        console.log(newProfileData);

        statusMessages.push({
          status: 'success',
          message: `Profile created successfully for ${createName(newProfileData[0]) || email}`,
        });

        return newProfileData[0];
      } else {
        console.log({ profileData });

        statusMessages.push({
          status: 'info',
          message: `Profile exists for ${createName(profileData) || profileData.email}`,
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
            message: `${createName(profile) || profile.email} already have the "${currentRole !== null ? currentRole.name : ''}" role.`,
          });
        } else if (existingRoleError) {
          statusMessages.push({
            status: 'error',
            message: `Error checking existing roles for ${createName(profile) || profile.email}`,
          });
          continue;
        } else {
          const { data: roleData, error: roleError } = await supabase
            .from('profiles_roles')
            .upsert({ profile_id: profile.id, role_id: roleId });

          console.log({ roleError });

          if (roleError) {
            statusMessages.push({
              status: 'error',
              message: `Failed to update roles for profile ${createName(profile) || profile.email}`,
            });
            continue;
          }

          if (currentRole !== null) {
            statusMessages.push({
              status: 'success',
              message: `${createName(profile) || profile.email} was given the  ${currentRole !== null ? currentRole.name : ''} role.`,
            });
          } else {
            statusMessages.push({
              status: 'success',
              message: `Role updated for ${createName(profile) || profile.email}`,
            });
          }
        }
      }

      // Step 3: Update the profiles_classes table if classId is provided
      if (roleId === 3) {
        if (!classId) {
          statusMessages.push({
            status: 'error',
            message: `A class ID is required for the ${currentRole !== null ? currentRole.name : ''} role`,
          });
          continue;
        }

        const { error: classError } = await supabase
          .from('profiles_classes')
          .upsert({ profile_id: profile.id, class_id: classId });

        console.log({ classError });

        if (classError) {
          statusMessages.push({
            status: 'error',
            message: `Failed to update class for profile ${createName(profile) || profile.email}`,
          });
          continue;
        }

        statusMessages.push({
          status: 'success',
          message: `Class updated successfully for profile ${createName(profile) || profile.email}`,
        });
      } else if (classId) {
        statusMessages.push({
          status: 'error',
          message: 'Class ID should not be provided for roles other than 3',
        });
        continue;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      statusMessages.push({
        status: 'error',
        message: `Unexpected error: ${error.message}`,
      });
    }
  }

  if (path) revalidatePath(path);

  return statusMessages;
}
