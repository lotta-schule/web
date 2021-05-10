import { gql } from '@apollo/client';

export const GetArticleQuery = gql`
    query GetArticle($id: ID!) {
        article(id: $id) {
            id
            insertedAt
            updatedAt
            title
            preview
            tags
            readyToPublish
            published
            isPinnedToTop
            previewImageFile {
                id
                remoteLocation
                mimeType
                fileType
            }
            contentModules {
                id
                type
                content
                sortKey
                configuration
                insertedAt
                updatedAt
                files {
                    id
                    remoteLocation
                    mimeType
                    fileType
                    filename
                    filesize
                    insertedAt
                    fileConversions {
                        id
                        format
                        mimeType
                        remoteLocation
                    }
                }
            }
            category {
                id
                title
                hideArticlesFromHomepage
            }
            groups {
                id
                sortKey
                name
            }
            users {
                id
                nickname
                name
                avatarImageFile {
                    remoteLocation
                }
            }
        }
    }
`;
