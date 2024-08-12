import EmojiAnimation from '@/components/EmojiAnimation/EmojiAnimation';
import LoginForm from '@/components/Forms/Login/Login';
import { IMessage, Message } from '@/components/Message/Message';
import { getUser } from '@/utils/server/user';
import dictionary from '@qualia/dictionary';
import { Box, Flex, Heading } from '@radix-ui/themes';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: IMessage;
}) {
  const user = await getUser();

  if (user?.id) redirect('/you');

  return (
    <>
      <div className="absolute h-screen w-full overflow-hidden bg-slate-100">
        <EmojiAnimation />
      </div>
      <Flex height={'100vh'} justify={'center'}>
        <Flex justify={'center'} align={'center'}>
          <Box
            className="rounded-2 bg-white/50 backdrop-blur-md"
            width="400px"
            p={'6'}
          >
            <Heading className="mb-4" as="h1" weight={'light'} size="8">
              {dictionary.login_title}
            </Heading>
            <Message {...searchParams} />
            <LoginForm />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
