import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata
} from '@loopback/authorization';
import {UserProfile} from '@loopback/security';
import _ from 'lodash';
import {permissionKeys} from '../authorization/permission-keys';
// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
import { } from '../controllers/admin.controller';
export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,


): Promise<AuthorizationDecision> {
  // No access if authorization details are missing
  let currentUser: UserProfile;

  if (authorizationCtx.principals.length > 0) {
    const user = _.pick(authorizationCtx.principals[0], [
      'id',
      'name',
      'permissions',
      'type'


    ]);
    currentUser = {id: user.id, name: user.name, roles: user.permissions};
    console.log('per,issions', user.permissions)
    console.log('user', authorizationCtx.roles);

  } else {
    return AuthorizationDecision.DENY;
  }

  if (!currentUser.roles) {
    console.log('roles', currentUser.roles)
    console.log('roles', currentUser.name)



    return AuthorizationDecision.ALLOW;
  }
  console.log("metadat", metadata);
  // Authorize everything that does not have a allowedRoles property
  if (!metadata.allowedRoles) {
    console.log('allowed', metadata.allowedRoles, permissionKeys.CreateJob)
    return AuthorizationDecision.DENY;

  }



  let roleIsAllowed = false;
  for (const role of currentUser.roles) {
    if (metadata.allowedRoles!.includes(role)) {
      roleIsAllowed = true;
      console.log('roleisallowed', roleIsAllowed);
      break;

    }
  }

  if (!roleIsAllowed) {
    return AuthorizationDecision.DENY;
  }


  return AuthorizationDecision.ALLOW;
}
