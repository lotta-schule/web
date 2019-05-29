import { ApolloError } from 'apollo-boost';
import { CategoryLayout } from './layouts/CategoryLayout';
import { CircularProgress } from '@material-ui/core';
import { client as apolloClient } from '../api/client';
import { ClientModel } from 'model';
import { ConnectedBaseLayout } from './layouts/ConnectedBaseLayout';
import { ConnectedEditArticleLayout } from './layouts/ConnectedEditArticleLayout';
import { createSetClientAction } from 'store/actions/client';
import { GetTenantQuery } from 'api/query/GetTenantQuery';
import { PageLayout } from './layouts/PageLayout';
import { Route, BrowserRouter, Switch, RouteComponentProps } from 'react-router-dom';
import { State } from 'store/State';
import { useSelector, useDispatch } from 'react-redux';
import React, { memo, useState } from 'react';
import store from 'store/Store';

export const ConnectedApp = memo(() => {
  const client = useSelector<State, ClientModel | null>(state => state.client.client);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApolloError | null>(null);
  const dispatch = useDispatch();
  if (!client && !error && !isLoading) {
    apolloClient.query<{ tenant: ClientModel }>({
      query: GetTenantQuery
    }).then(({ loading, errors, data }) => {
      setIsLoading(loading);
      if (errors) {
        setError(errors[0]);
      }
      dispatch(createSetClientAction(data.tenant || null));
    });
  }

  if (error) {
    return (
      <div><span style={{ color: 'red' }}>{error.message}</span></div>
    );
  }
  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  if (!client) {
    return (
      <div>
        <span>Adresse ungültig.</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={'/'} component={() => (<ConnectedBaseLayout>Nicht gefunden</ConnectedBaseLayout>)} />
        <Route exact path={'/'} component={memo(() => (
          <CategoryLayout
            category={null!}
            articles={store.getState().content.articles.filter(article => !article.category)}
          />
        ))} />
        <Route path={'/category/:id'} component={memo<RouteComponentProps<{ id: string }>>(({ match }) => (
          <CategoryLayout
            category={store.getState().content.categories.find(category => category.id === match.params.id)!}
            articles={store.getState().content.articles.filter(article => !!article.category && article.category.id === match.params.id)}
          />
        ))} />
        <Route path={'/page/:id'} component={memo<RouteComponentProps<{ id: string }>>(({ match }) => (
          <PageLayout
            title={match.params.id}
            articles={store.getState().content.articles.filter(article => (
              article.pageName === match.params.id || article.id === match.params.id
            ))}
          />
        ))} />
        <Route path={'/article/:id'} component={memo<RouteComponentProps<{ id: string }>>(({ match }) => <ConnectedEditArticleLayout articleId={match.params.id} />)} />
        <Route component={() => <div>Nicht gefunden</div>} />
      </Switch>
    </BrowserRouter>
  );
});