import * as React from 'react';
import { useQuery } from '@apollo/client';
import { UserModel, UserGroupModel } from 'model';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { UserAvatar } from 'shared/userAvatar/UserAvatar';
import { GroupSelect } from 'shared/edit/GroupSelect';
import {
  Input,
  Label,
  LinearProgress,
  Select,
  Option,
  Table,
} from '@lotta-schule/hubert';
import { EditUserPermissionsDialog } from './EditUserPermissionsDialog';
import { useDebounce } from 'util/useDebounce';
import clsx from 'clsx';

import SearchUsersAsAdminQuery from 'api/query/SearchUsersAsAdminQuery.graphql';

import styles from './UserList.module.scss';

export const UserList = React.memo(() => {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const [searchText, setSearchText] = React.useState('');
  const debouncedSearchtext = useDebounce(searchText, 500);
  const [selectedUser, setSelectedUser] = React.useState<UserModel | null>(
    null
  );

  const [searchFilter, setSearchFilter] = React.useState<{
    name: string;
    groups: UserGroupModel[];
    lastSeen: number | null;
  }>({
    name: '',
    groups: [],
    lastSeen: null,
  });

  React.useEffect(
    () => setSearchFilter((f) => ({ ...f, name: debouncedSearchtext })),
    [debouncedSearchtext]
  );

  const searchIsValid =
    searchFilter.name.length > 2 ||
    searchFilter.groups.length ||
    searchFilter.lastSeen;

  const { data, loading: isLoading } = useQuery<{ users: UserModel[] }>(
    SearchUsersAsAdminQuery,
    {
      variables: {
        searchtext: searchFilter.name || null,
        groups: searchFilter.groups.length
          ? searchFilter.groups.map(({ id }) => ({ id }))
          : null,
        lastSeen: searchFilter.lastSeen,
      },
      skip: !searchIsValid,
    }
  );

  const rows = React.useMemo(() => {
    return (
      data?.users?.map((user) => ({
        avatarImage: (
          <UserAvatar className={styles.avatar} user={user} size={25} />
        ),
        name: (
          <>
            {user.name}
            {user.nickname && (
              <>
                {' '}
                &nbsp; (<strong>{user.nickname}</strong>)
              </>
            )}
          </>
        ),
        groups: user.groups.map((g) => g.name).join(', '),
        lastSeen: user.lastSeen
          ? format(new Date(user.lastSeen), 'PPP', { locale: de })
          : '',
        user,
      })) ?? []
    );
  }, [data]);

  return (
    <section className={styles.root}>
      <h5 className={styles.headline}>Nutzersuche</h5>

      <div className={styles.toolbar}>
        <Label label={'Name suchen:'}>
          <Input
            className={clsx(styles.headline)}
            value={searchText}
            onChange={(e) =>
              setSearchText((e.target as HTMLInputElement).value)
            }
            placeholder={'Napoleon Bonaparte'}
          />
        </Label>

        <GroupSelect
          row
          hidePublicGroupSelection
          disableAdminGroupsExclusivity
          label={'Nach Gruppe filtern:'}
          selectedGroups={searchFilter.groups ?? []}
          onSelectGroups={(groups) =>
            setSearchFilter({ ...searchFilter, groups })
          }
          className={styles.filter}
        />

        <div className={clsx(styles.filter, styles.selectfield)}>
          <Select
            title={'zuletzt angemeldet'}
            onChange={(lastSeen) =>
              setSearchFilter({
                ...searchFilter,
                lastSeen: lastSeen === 'null' ? null : Number(lastSeen),
              })
            }
          >
            <Option value={'30'}>vor 30 Tagen oder mehr</Option>
            <Option value={'90'}>vor 90 Tage oder mehr</Option>
            <Option value={'180'}>vor 6 Monate oder mehr</Option>
            <Option value={'365'}>vor einem Jahr oder mehr</Option>
            <Option value={'null'}>zurücksetzen</Option>
          </Select>
        </div>
      </div>

      {isLoading && (
        <LinearProgress
          isIndeterminate
          label={'Nutzersuche läuft'}
          data-testid="loading"
        />
      )}

      {!searchIsValid && <div>Suchkritierien wählen um Nutzer zu finden.</div>}

      {rows.length === 0 && searchIsValid && !isLoading && (
        <div>Keine Nutzer gefunden.</div>
      )}

      {rows.length > 0 && searchIsValid && !isLoading && (
        <>
          <div>
            {t('administration.results', {
              count: rows.length,
            })}
          </div>

          <div className={clsx(styles.respTable)}>
            <Table>
              <thead>
                <tr className={clsx(styles.tableHead)}>
                  <th></th>
                  <th>Name</th>
                  <th>Gruppen</th>
                  <th>Zuletzt Online</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ user, avatarImage, name, groups, lastSeen }) => (
                  <tr
                    key={user.id}
                    onClick={() => {
                      if (user.id !== currentUser?.id) {
                        setSelectedUser(user);
                      }
                    }}
                  >
                    <td>{avatarImage}</td>
                    <td>{name}</td>
                    <td>{groups}</td>
                    <td>{lastSeen}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {selectedUser && (
            <EditUserPermissionsDialog
              onRequestClose={() => setSelectedUser(null)}
              user={selectedUser}
            />
          )}
        </>
      )}
    </section>
  );
});
UserList.displayName = 'AdminUserList';
