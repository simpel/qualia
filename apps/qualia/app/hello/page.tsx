import { Box, Flex, Heading } from '@radix-ui/themes';
import { redirect } from 'next/navigation';

import EmojiAnimation from '@/components/EmojiAnimation/EmojiAnimation';
import CreateProfileForm from '@/components/Forms/CreateProfile/CreateProfile';
import { IMessage, Message } from '@/components/Message/Message';
import { getProfile } from '@/utils/server/profile';

export default async function HelloPage({
  searchParams,
}: {
  searchParams: IMessage;
}) {
  const { user, profile } = await getProfile();

  if (profile?.data) redirect('/you');
  if (!user.data.user?.id) redirect('/login');

  return (
    <>
      <div className="absolute h-screen w-full overflow-hidden bg-slate-100">
        <EmojiAnimation />
      </div>
      <Flex height={'100vh'} justify={'center'}>
        <Flex justify={'center'} align={'center'}>
          <Box
            className="rounded-2	bg-white/50 backdrop-blur-md"
            width="400px"
            p={'6'}
          >
            <Heading className="mb-4" as="h1" weight={'light'} size="8">
              Let's setup your profile
            </Heading>
            <Message {...searchParams} />

            <CreateProfileForm email={user.data.user?.email} />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
