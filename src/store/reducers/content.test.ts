import { contentReducer } from './content';
import { ContentActionType } from '../actions/content';
import { ContentModuleType } from '../../model';

describe('content reducer', () => {

    it('should handle ADD_CATEGORY', () => {
        expect(
            contentReducer({ articles: [], categories: [] }, {
                type: ContentActionType.ADD_CATEGORY,
                category: {
                    id: 'C001',
                    title: 'Fächer'
                }
            })
        ).toEqual({
            categories: [{
                id: 'C001',
                title: 'Fächer'
            }],
            articles: []
        });
    });

    it('should handle ADD_ARTICLE', () => {
        expect(
            contentReducer({ articles: [], categories: [] }, {
                type: ContentActionType.ADD_ARTICLE,
                article: {
                    id: 'A001',
                    modules: [],
                    preview: 'Hallo',
                    title: 'Artikel 001'
                }
            })
        ).toEqual({
            categories: [],
            articles: [{
                id: 'A001',
                modules: [],
                preview: 'Hallo',
                title: 'Artikel 001'
            }]
        });
    });

    it('should handle ADD_CONTENT_MODULE', () => {
        expect(
            contentReducer({
                articles: [{
                    id: 'A001',
                    modules: [],
                    preview: 'Hallo',
                    title: 'Artikel 001'
                }],
                categories: []
            }, {
                    type: ContentActionType.ADD_CONTENT_MODULE,
                    articleId: 'A001',
                    contentModule: {
                        id: 'CM001',
                        type: ContentModuleType.Text
                    }
                })
        ).toEqual({
            categories: [],
            articles: [{
                id: 'A001',
                modules: [{
                    id: 'CM001',
                    type: ContentModuleType.Text
                }],
                preview: 'Hallo',
                title: 'Artikel 001'
            }]
        });
    });

    it('should handle ADD_CONTENT_MODULE', () => {
        expect(
            contentReducer({
                articles: [{
                    id: 'A001',
                    modules: [{
                        id: 'CM001',
                        type: ContentModuleType.Text
                    }],
                    preview: 'Hallo',
                    title: 'Artikel 001'
                }],
                categories: []
            }, {
                    type: ContentActionType.UPDATE_CONTENT_MODULE,
                    articleId: 'A001',
                    contentModule: {
                        id: 'CM001',
                        type: ContentModuleType.Text,
                        text: 'New Text'
                    }
                })
        ).toEqual({
            categories: [],
            articles: [{
                id: 'A001',
                modules: [{
                    id: 'CM001',
                    type: ContentModuleType.Text,
                    text: 'New Text'
                }],
                preview: 'Hallo',
                title: 'Artikel 001'
            }]
        });
    });
});