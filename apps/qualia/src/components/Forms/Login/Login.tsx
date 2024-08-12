import dictionary from '@qualia/dictionary';
import { Box, Text, TextField } from '@radix-ui/themes';
import { sendMagicLink } from '../../../actions/sendMagicLink';
import { Button } from '../Button/Button';

const LoginForm = () => {
  const next = '/login';
  const source = '/login';
  const sendMagicLinkAction = sendMagicLink.bind(null, next, source);

  return (
    <div>
      <form
        className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground"
        action={sendMagicLinkAction}
      >
        <Box width={'100%'} my={'4'}>
          <Text weight={'bold'}>{dictionary['fields_email']}</Text>
          <TextField.Root
            size="3"
            name="email"
            mt="1"
            placeholder={dictionary['fields_email']}
            required
          />
        </Box>

        <Button
          type="submit"
          size="4"
          pendingText={dictionary['sending_magic_link']}
        >
          {dictionary['send_magic_link']}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
