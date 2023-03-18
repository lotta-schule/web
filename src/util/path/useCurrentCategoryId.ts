import { ArticleModel } from 'model';
import { ID } from 'model/ID';
// import { useQuery } from '@apollo/client';
import { usePathname } from 'next/navigation';
// import GetArticleQuery from 'api/query/GetArticleQuery.graphql';

export const useCurrentCategoryId = (): ID | null => {
    const pathname = usePathname();
    const matchesCategoryUrl = pathname?.match(/^\/c?\/(\d*)/);
    const matchesArticleUrl = pathname?.match(/^\/a?\/(\d*)/);
    // TODO: Fix this
    // const { data } = useQuery<{ article: ArticleModel }, { id: ID }>(
    //     GetArticleQuery,
    //     {
    //         variables: matchesArticleUrl
    //             ? { id: matchesArticleUrl![1] }
    //             : null!,
    //         skip: !matchesArticleUrl || matchesArticleUrl.length < 2,
    //     }
    // );
    const data = { article: null as ArticleModel | null };
    if (matchesCategoryUrl) {
        return matchesCategoryUrl[1];
    } else if (matchesArticleUrl) {
        return data?.article?.category?.id ?? null;
    }
    return null;
};
