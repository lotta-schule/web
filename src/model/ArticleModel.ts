import { CategoryModel } from './CategoryModel';
import { ContentModuleModel } from './ContentModuleModel';

export interface ArticleModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    preview?: string;
    previewImage?: string;
    modules: ContentModuleModel[];
    category?: CategoryModel;
    pageName?: string;
}
