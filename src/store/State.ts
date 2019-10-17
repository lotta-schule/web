import { ClientModel, FileModel, UploadModel, ArticleModel, CategoryModel } from '../model';

export interface ClientState {
    client: ClientModel | null;
    categories: CategoryModel[];
}

export interface UserFilesState {
    files: FileModel[] | null;
    uploads: UploadModel[];
}

export interface ContentState {
    articles: ArticleModel[];
    didFetchQueryKeys: string[];
}

export interface LayoutState {
    isDrawerOpen: boolean;
}

export interface State {
    client: ClientState;
    content: ContentState;
    userFiles: UserFilesState;
    layout: LayoutState;
}
