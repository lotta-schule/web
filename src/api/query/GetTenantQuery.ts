import gql from 'graphql-tag';

export const GetTenantQuery = gql`
    query GetTenant {
        tenant {
            id
            title
            slug
            logoImageFile {
                id
                remoteLocation
            }
            groups {
                id
                name
                priority
                isAdminGroup
            }
        }
    }
`;