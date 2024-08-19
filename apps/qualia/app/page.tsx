import {
  AuthorizedStartPage,
  CreateProfileStartPage,
  UnAuthorizedStartPage,
} from '@/components/pages/Startpage';

import { getProfile } from '@/utils/server/profile';

export default async function IndexPage() {
  const { profile, user } = await getProfile();

  const renderPage = () => {
    if (user.data.user !== null && profile?.data === null)
      return <CreateProfileStartPage user={user.data.user} />;
    if (user.data.user !== null && profile?.data) {
      return (
        <AuthorizedStartPage user={user.data.user} profile={profile.data} />
      );
    }
    return <UnAuthorizedStartPage />;
  };

  return renderPage();
}
