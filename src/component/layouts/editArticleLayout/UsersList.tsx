import React, { memo } from 'react';
import { Close as CloseIcon } from '@material-ui/icons';
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    makeStyles,
} from '@material-ui/core';
import { User } from 'util/model';
import { UserAvatar } from 'component/user/UserAvatar';
import { UserModel } from 'model';

export interface UsersListProps {
    users: UserModel[];
    onClickRemove?(user: UserModel): void;
}

const useStyles = makeStyles(() => ({
    avatar: {
        width: 50,
        height: 50,
    },
}));

export const UsersList = memo<UsersListProps>(({ users, onClickRemove }) => {
    const styles = useStyles();

    if (!users.length) {
        return null;
    }
    return (
        <List aria-label={'Nutzer'}>
            {users.map((user) => (
                <ListItem
                    key={user.id}
                    dense
                    ContainerProps={{ 'aria-label': User.getNickname(user) }}
                >
                    <ListItemAvatar>
                        <UserAvatar
                            className={styles.avatar}
                            user={user}
                            size={50}
                        />
                    </ListItemAvatar>
                    <ListItemText>{User.getNickname(user)}</ListItemText>
                    <ListItemSecondaryAction>
                        <IconButton
                            edge={'end'}
                            aria-label={'entfernen'}
                            onClick={
                                onClickRemove && (() => onClickRemove(user))
                            }
                        >
                            <CloseIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
});
