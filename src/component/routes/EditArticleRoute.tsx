import React, { memo } from 'react';
import { ArticleModel } from 'model';
import { CircularProgress } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { EditArticleLayout } from 'component/layouts/editArticleLayout/EditArticleLayout';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { ID } from 'model/ID';
import { GetArticleQuery } from 'api/query/GetArticleQuery';

export const EditArticleRoute = memo<RouteComponentProps<{ id: string }>>(
    ({ match }) => {
        const id = match.params.id.replace(/^(\d+).*/, '$1'); // take only first digits

        const { data, error, loading: isLoading } = useQuery<
            { article: ArticleModel },
            { id: ID }
        >(GetArticleQuery, { variables: { id } });

        if (!data || isLoading) {
            return (
                <div>
                    <CircularProgress />
                </div>
            );
        }
        if (error) {
            return <ErrorMessage error={error} />;
        }
        if (data) {
            return <EditArticleLayout article={data!.article} />;
        }
        return null;
    }
);
export default EditArticleRoute;
