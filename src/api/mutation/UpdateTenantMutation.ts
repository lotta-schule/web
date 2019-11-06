import gql from 'graphql-tag';

export const UpdateTenantMutation = gql`
    mutation UpdateTenant($tenant: TenantInput) {
        updateTenant(tenant: $tenant) {
            id
            title
            slug
            logoImageFile {
                id
                remoteLocation
            }
        }
    }
`;