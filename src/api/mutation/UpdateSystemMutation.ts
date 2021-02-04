import { gql } from '@apollo/client';

export const UpdateSystemMutation = gql`
    mutation UpdateSystem($system: SystemInput) {
        updateSystem(system: $system) {
            id
            title
            slug
            customTheme
            userMaxStorageConfig
            logoImageFile {
                id
                remoteLocation
            }
            backgroundImageFile {
                id
                remoteLocation
            }
        }
    }
`;
