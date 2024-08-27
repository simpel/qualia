import { logout } from '@/actions/logout';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import { buttonVariants } from '@/shadcn/components/ui/button';
import hasRole from '@/utils/hasRole/hasRole';
import { createName } from '@/utils/profle/createName/createName';
import { getProfile } from '@/utils/server/profile';
import dictionary from '@qualia/dictionary';
import Link from 'next/link';
import { Button } from '../Forms/Button/Button';

export const Header = async () => {
  const { profile, roles } = await getProfile();

  const isAdmin = hasRole(roles, 'admin');

  console.log({ isAdmin });

  const logoutAction = logout.bind(null, '/');

  return (
    <header className="sticky left-0 right-0 top-0 bg-white/10 backdrop-blur-xl">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="my-4 font-serif text-4xl font-thin">
            {dictionary.site_name}
          </h1>
          {isAdmin && (
            <nav className="flex gap-4">
              <Link
                href="/users"
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                {dictionary.users}
              </Link>
            </nav>
          )}
          {profile?.data && (
            <div className="flex items-center justify-between gap-6">
              <Avatar>
                <AvatarImage
                  src={
                    profile.data.gravatar
                      ? `https://www.gravatar.com/avatar/${profile.data.gravatar}?s=100&d=404`
                      : undefined
                  }
                />
                <AvatarFallback>
                  {createName(profile.data, true)}
                </AvatarFallback>
              </Avatar>
              <span>
                {dictionary.hi} {profile.data.first_name}!
              </span>
              <form action={logoutAction}>
                <Button pendingText={dictionary.logging_out}>
                  {dictionary.logout}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
