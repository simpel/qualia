import { logout } from '@/actions/logout';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import { getProfile } from '@/utils/server/profile';
import dictionary from '@qualia/dictionary';
import { Button } from '../Forms/Button/Button';

export const Header = async () => {
  const next = '/';

  const { profile } = await getProfile();

  const avatarFallback = `${profile?.data?.first_name.charAt(0)}${profile?.data?.last_name.charAt(0)}`;

  const logoutAction = logout.bind(null, next);

  return (
    <header className="sticky left-0 right-0 top-0 bg-white/10 backdrop-blur-xl">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="my-4 font-serif text-4xl font-thin">
            {dictionary.site_name}
          </h1>
          {profile?.data && (
            <div className="flex items-center justify-between gap-6">
              <Avatar>
                <AvatarImage
                  src={
                    profile.data.gravatar
                      ? `https://www.gravatar.com/avatar/${profile.data.gravatar}`
                      : undefined
                  }
                />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <span>
                {dictionary.hi} {profile.data.first_name}!
              </span>
              <form action={logoutAction}>
                <Button
                  pendingText={dictionary.logging_out}
                  variant={'outline'}
                >
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
