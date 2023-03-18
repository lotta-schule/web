import { CategoryModel } from 'model';
import { ID } from 'model/ID';
import find from 'lodash/find';

export const useCategoriesAncestorsForItem = (
    categoryId: ID,
    allCategories: CategoryModel[]
): ID[] => {
    let categoriesHierarchy: ID[] = [];
    let lastFoundCategory: CategoryModel | null = null;
    for (let i = 0; i < 5; i++) {
        // max 5 levels
        const currentLevelCategoryId = (
            lastFoundCategory
                ? lastFoundCategory.category && lastFoundCategory.category.id
                : categoryId
        ) as ID | undefined;
        if (!currentLevelCategoryId) {
            break;
        }
        lastFoundCategory =
            find(
                allCategories,
                (category: CategoryModel) =>
                    category.id === currentLevelCategoryId
            ) || (null as CategoryModel | null);
        if (lastFoundCategory && lastFoundCategory.category) {
            categoriesHierarchy = [
                lastFoundCategory.category.id,
                ...categoriesHierarchy,
            ];
        } else {
            break;
        }
    }
    return categoriesHierarchy;
};
