import { ArticleModel } from './ArticleModel';
import { CategoryModel } from './CategoryModel';
import { ContentModuleModel } from './ContentModuleModel';
import { ID } from './ID';

export interface PageModel {
    id: ID;
    title: string;
    preview?: string;
    category?: CategoryModel;
    modules: ContentModuleModel[];
    articles: ArticleModel[];
}
