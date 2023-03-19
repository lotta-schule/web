import { ArticleModel } from "model"

export type ArticlePageProps = {
    article: ArticleModel;
}

export const ArticlePage = ({ article }: ArticlePageProps) => {
    return (
        <pre>
                {JSON.stringify(article)}
        </pre>
    );
}
