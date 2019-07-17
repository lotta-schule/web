export enum ContentModuleType {
    TITLE = 'TITLE',
    TEXT = 'TEXT',
}

export interface ContentModuleModel {
    id: string;
    type: ContentModuleType;
    sortKey: number;
    text?: string;
}

export type ContentModuleInput = Omit<ContentModuleModel, 'id'>;