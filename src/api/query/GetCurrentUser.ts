import { gql } from '@apollo/client';

export const GetCurrentUserQuery = gql`
    query GetCurrentUser {
        currentUser {
            id
            insertedAt
            updatedAt
            lastSeen
            name
            nickname
            email
            class
            hideFullName
            enrollmentTokens
            hasChangedDefaultPassword
            avatarImageFile {
                id
            }
            groups {
                id
                name
                isAdminGroup
            }
        }
    }
`;
