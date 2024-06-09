import { cache } from 'react';
import { getClient } from 'api/client';
import { UserGroupModel } from 'model';

import GetUserGroupsQuery from 'api/query/GetUserGroupsQuery.graphql';

export const loadUserGroups = cache(async () => {
  return await getClient()
    .query<{ userGroups: UserGroupModel[] }>({
      query: GetUserGroupsQuery,
    })
    .then(({ data }) => data?.userGroups ?? []);
});
