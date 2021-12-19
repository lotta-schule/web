import { UserGroupModel } from './UserGroupModel';
import { UserModel } from './UserModel';
import { ID } from './ID';

export type NewMessageDestination =
    | { group: UserGroupModel; user?: never }
    | { user: UserModel; group?: never };

export interface ConversationModel {
    id: ID;
    insertedAt: string;
    updatedAt: string;
    unreadMessages?: number;
    groups: UserGroupModel[];
    users: UserModel[];
    messages: MessageModel[];
}

export interface MessageModel {
    id: ID;
    insertedAt: string;
    updatedAt: string;
    content: string;
    user: UserModel;
    conversation?: ConversationModel;
}
