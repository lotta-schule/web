import { memo, useRef, useState } from 'react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@lotta-schule/hubert';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { ArticleModel } from 'model';
import { Icon } from 'shared/Icon';
import { ReactionSelector } from './ReactionSelector';
import { ReactionCountButtons } from './ReactionCountButtons';

import styles from './ArticleReactions.module.scss';

import GetArticleReactionCounts from 'api/query/GetArticleReactionCounts.graphql';
import ReactToArticleMutation from 'api/mutation/ReactToArticleMutation.graphql';

export type ArticleReactionsProps = {
  article: ArticleModel;
};

export const ArticleReactions = memo(({ article }: ArticleReactionsProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [isReactionSelectorOpen, setIsReactionSelectorOpen] = useState(false);

  const [reactToArticle] = useMutation(ReactToArticleMutation);
  const {
    data: {
      article: { reactionCounts },
    },
  } = useSuspenseQuery<{
    article: Required<Pick<ArticleModel, 'reactionCounts'>>;
  }>(GetArticleReactionCounts, {
    variables: { id: article.id },
  });

  return (
    <div data-testid="ArticleReactions" className={styles.root}>
      <ReactionSelector
        trigger={buttonRef.current!}
        isOpen={isReactionSelectorOpen}
        onSelect={(reaction) => {
          if (reaction) {
            reactToArticle({
              variables: {
                id: article.id,
                reaction: reaction.toUpperCase(),
              },
            });
          }
          setIsReactionSelectorOpen(false);
        }}
      />
      <ReactionCountButtons
        reactions={reactionCounts}
        onSelect={() => setIsReactionSelectorOpen(true)}
      />
      <Button
        ref={buttonRef}
        title={`Auf "${article.title}" reagieren`}
        icon={<Icon icon={faAdd} />}
        onClick={() => setIsReactionSelectorOpen(true)}
      />
    </div>
  );
});
ArticleReactions.displayName = 'ArticleReactions';
