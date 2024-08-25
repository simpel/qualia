'use server';

import { IStatus } from '@/types/generic';
import { createClient } from '@/utils/clients/server';
import { parseDictionary } from '@/utils/dictionary/dictionary';
import { createName } from '@/utils/profle/createName/createName';
import dictionary from '@qualia/dictionary';
import { sha256 } from 'js-sha256';
import { revalidatePath } from 'next/cache';
import { Tables } from '../types/supabase';

export const addProfilesToClass = async (
  emails: string[],
  classId: Tables<'classes'>['id'],
): Promise<IStatus[] | void> => {
  const supabase = createClient();
  const results: IStatus[] = [];

  await Promise.all(
    emails.map(async (email) => {
      try {
        // Check if the profile exists
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('email', email)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          // Handle error when fetching profile fails
          results.push({
            status: 'error',
            message: parseDictionary(dictionary.profile_fetch_error, {
              name: email,
            }),
          });
          return;
        }

        // If profile doesn't exist, create it
        if (!profile) {
          const { data: newProfile, error: newProfileError } = await supabase
            .from('profiles')
            .insert({ email, gravatar: sha256(email) })
            .select('id, first_name, last_name')
            .single();

          if (newProfileError) {
            // Handle error when creating profile fails
            results.push({
              status: 'error',
              message: parseDictionary(
                dictionary.create_profile_error_for_email,
                {
                  email: email,
                },
              ),
            });
            return;
          }

          profile = newProfile;
        }

        // Check if the profile is already added to the class
        const { data: classUser, error: classUserError } = await supabase
          .from('classes_users')
          .select('*')
          .eq('class_id', classId)
          .eq('profile_id', profile.id)
          .single();

        if (classUserError && classUserError.code !== 'PGRST116') {
          // Handle error when checking class_user fails
          results.push({
            status: 'error',
            message: dictionary.class_add_students_error,
          });
          return;
        }

        // If not already in class, add it
        if (!classUser) {
          const { error: insertError } = await supabase
            .from('classes_users')
            .insert({ class_id: classId, profile_id: profile.id });

          if (insertError) {
            // Handle error when inserting into classes_users fails
            results.push({
              status: 'error',
              message: parseDictionary(dictionary.class_add_student_error, {
                name: createName(profile) || email,
              }),
            });
            return;
          }

          results.push({
            status: 'success',
            message: parseDictionary(dictionary.class_add_student_success, {
              name: createName(profile) || email,
            }),
          });
        } else {
          results.push({
            status: 'info',
            message: parseDictionary(
              dictionary.class_add_student_already_exists,
              {
                name: createName(profile) || email,
              },
            ),
          });
        }
      } catch (error) {
        results.push({
          status: 'error',
          message: dictionary.class_add_students_error,
        });
      }
    }),
  );

  revalidatePath(`/classes/${classId}`);
  return results;
};
