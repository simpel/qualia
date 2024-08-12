import { logout } from '@/actions/logout';
import { Tables } from '@/types/supabase';
import dictionary from '@qualia/dictionary';
import { Avatar, Flex, Heading, HoverCard } from '@radix-ui/themes';
import Link, { LinkProps } from 'next/link';
import { Button } from '../Forms/Button/Button';

export interface IHeader {
  profile: Tables<'profiles'>;
}

const menu: LinkProps[] = [
  { href: '/you', children: 'Assignments' },
  { href: '/login', children: 'Submissions' },
  { href: '/hello', children: 'Profile' },
];

export const Header = ({ profile }: IHeader) => {
  const next = '/';

  const avatarFallback = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`;

  const logoutAction = logout.bind(null, next);

  return (
    <Flex
      asChild
      gap={'8'}
      align={'center'}
      justify={'between'}
      width="100%"
      px={'4'}
      position={'absolute'}
      top={'0'}
      left={'0'}
      right={'0'}
      height="60px"
      className="bg-white/50 backdrop-blur-md"
    >
      <header>
        <Flex align={'baseline'} gap={'8'}>
          <Heading asChild weight={'light'} size={'7'}>
            <p>{dictionary.site_name}</p>
          </Heading>
          <nav>
            <Flex gap={'6'}>
              {menu.map((item, index) => (
                <Link {...item} className="font-light" key={index} />
              ))}
            </Flex>
          </nav>
        </Flex>

        <Flex gap={'6'} align={'center'}>
          <Flex align="center" gap="2">
            <HoverCard.Root>
              <HoverCard.Trigger>
                <Avatar
                  radius="full"
                  src={
                    profile.gravatar
                      ? `https://www.gravatar.com/avatar/${profile.gravatar}`
                      : undefined
                  }
                  fallback={avatarFallback}
                />
              </HoverCard.Trigger>
              <HoverCard.Content maxWidth="300px">
                <Flex gap="4">
                  <span>
                    {dictionary.hi} {profile.first_name}!
                  </span>

                  <form action={logoutAction}>
                    <Button pendingText={dictionary.logging_out}>
                      {dictionary.logout}
                    </Button>
                  </form>
                </Flex>
              </HoverCard.Content>
            </HoverCard.Root>
          </Flex>
        </Flex>
      </header>
    </Flex>
  );
};
