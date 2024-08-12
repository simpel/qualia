import dictionary from '@qualia/dictionary';
import { Box, Text, TextField } from '@radix-ui/themes';
import { User } from '@supabase/supabase-js';
import { createProfile } from '../../../actions/createProfile';
import { Button } from '../Button/Button';

export type ICreateProfile = {
  email: User['email'];
};

const CreateProfileForm = ({ email }: ICreateProfile) => {
  const next = '/you';
  const source = '/hello';

  const createProfileAction = createProfile.bind(null, next, source);

  return (
    <form action={createProfileAction}>
      <Box width={'100%'} my={'4'}>
        <Text weight={'bold'}>Your first name</Text>
        <TextField.Root
          size="3"
          name="first_name"
          mt="1"
          placeholder="You first name"
          required
        />
      </Box>
      <Box width={'100%'} my={'4'}>
        <Text weight={'bold'}>Your last name</Text>
        <TextField.Root
          size="3"
          mt="1"
          name="last_name"
          placeholder="You last name"
          required
        />
      </Box>

      <Box width={'100%'} my={'4'}>
        <Text weight={'bold'}>Your e-mail</Text>
        <TextField.Root
          type="email"
          name="email"
          size="3"
          mt="1"
          defaultValue={email}
          placeholder="You email"
          required
        />
      </Box>

      <Box width={'100%'} mt="6">
        <Button
          className="mt-4"
          type="submit"
          size="4"
          pendingText={dictionary.create_profile_continuing}
        >
          {dictionary.create_profile_continue}
        </Button>
      </Box>
    </form>
  );
};

export default CreateProfileForm;
