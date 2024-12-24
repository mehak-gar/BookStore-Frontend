// ** React Imports
import { ReactNode, useState } from 'react';

// ** Next Imports
import { useRouter } from 'next/router';

// ** Spinner Import
import { MainSpinner } from '@wiznox/common';

import { ACLObj, AppAbility, buildAbilityFor } from '../configs/acl';
import { AbilityContext } from '../context/acl/Can';
import { useAuth } from '../hooks/useAuth';
import { BlankLayout } from '@wiznox/common';
import NotAuthorized from '../pages/NotAuthorized';
import { AuthValuesType } from '../context/types';

interface AclGuardProps {
  children: ReactNode;
  guestGuard: boolean;
  aclAbilities: ACLObj;
  defineRulesFor:(auth: AuthValuesType, subject: string)=>void
}

export const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard,defineRulesFor } = props;

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined);

  // ** Hooks
  const auth = useAuth();
  const router = useRouter();

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  if (
    guestGuard ||
    router.route === '/404' ||
    router.route === '/500' ||
    router.route === '/'
  ) {
    return <div>{children}</div>;
  }

  // User is logged in, build ability for the user based on his role
  if (auth.user && auth.user.roles && auth?.metaData && !ability) {
    setAbility(buildAbilityFor(auth, aclAbilities.subject,defineRulesFor));
  }

  // Check the access of current user and render pages
  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    const values: any = {
      ability, reBuild: () => {
        if (auth?.user?.roles && auth?.metaData) {
          setAbility(buildAbilityFor(auth, aclAbilities.subject,defineRulesFor))
        }
      }
    }

    return (
      <AbilityContext.Provider value={values}>
        {children}
      </AbilityContext.Provider>
    );
  }

  //if ability is undefined, spinner runs.
  if (!ability) {
    return <MainSpinner />;
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  );
};

export default AclGuard;
