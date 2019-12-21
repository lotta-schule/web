import { GetCurrentUserQuery } from 'api/query/GetCurrentUser';
import { UserModel } from 'model';
import { createCloseDrawerAction } from 'store/actions/layout';
import { LogoutMutation } from 'api/mutation/LogoutMutation';
import { useApolloClient, useMutation } from 'react-apollo';
import { useDispatch } from 'react-redux';
import Matomo from 'matomo-ts';

export const useOnLogout = () => {
    const apolloClient = useApolloClient();
    const [logout] = useMutation(LogoutMutation, {
        onCompleted: () => {
            apolloClient.writeQuery<{ currentUser: UserModel | null }>({
                query: GetCurrentUserQuery,
                data: {
                    currentUser: null
                }
            });
            if (window._paq) {
                Matomo.default().resetUserId();
            }
            apolloClient.resetStore();
            localStorage.clear();

            dispatch(createCloseDrawerAction());
        }
    });
    const dispatch = useDispatch();

    return logout;
};