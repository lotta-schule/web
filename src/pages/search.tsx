import * as React from 'react';
import { GetServerSidePropsContext } from 'next';
import { CircularProgress } from '@material-ui/core';
import { Button } from 'component/general/button/Button';
import { useQuery } from '@apollo/client';
import { ArticlePreviewDensedLayout } from 'component/article/ArticlePreviewDensedLayout';
import { ArticleModel, CategoryModel } from 'model';
import { useDebounce } from 'util/useDebounce';
import { BaseLayoutMainContent } from 'component/layouts/BaseLayoutMainContent';
import { Header } from 'component/general/Header';
import { BaseLayoutSidebar } from 'component/layouts/BaseLayoutSidebar';
import { animated, useSpring } from 'react-spring';
import { CategorySelect } from 'component/layouts/editArticleLayout/CategorySelect';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { Label } from 'component/general/label/Label';
import { Input } from 'component/general/form/input/Input';
import SearchQuery from 'api/query/SearchQuery.graphql';

import styles from './search.module.scss';

const Search = () => {
    const [searchText, setSearchText] = React.useState('');
    const [isAdvancedSearchFormVisible, setIsAdvancedSearchFormVisible] =
        React.useState(false);
    const [category, setCategory] = React.useState<CategoryModel | null>(null);
    const debouncedSearchtext = useDebounce(searchText, 500);
    const springProps = useSpring({
        maxHeight: isAdvancedSearchFormVisible ? 400 : 0,
        opacity: isAdvancedSearchFormVisible ? 1 : 0,
    });

    const { data, loading: isLoading } = useQuery(SearchQuery, {
        variables: {
            searchText: debouncedSearchtext,
            options: { categoryId: category?.id ?? null },
        },
        skip: !debouncedSearchtext,
    });

    return (
        <>
            <BaseLayoutMainContent>
                <Header bannerImageUrl={'/searchBanner.png'}>
                    <h2>Suche</h2>
                </Header>

                <section className={styles.inputSection}>
                    <div className={styles.description}>
                        Gib ein oder mehrere Suchbegriffe in das Suchfeld ein.
                    </div>
                    <Label label={'Suchbegriff'}>
                        <Input
                            autoFocus
                            id={'searchfield'}
                            type={'search'}
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(e.currentTarget.value)
                            }
                        />
                    </Label>
                    <Button
                        className={styles.advancedSettingsButton}
                        onClick={() =>
                            setIsAdvancedSearchFormVisible(
                                !isAdvancedSearchFormVisible
                            )
                        }
                        icon={
                            isAdvancedSearchFormVisible ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            )
                        }
                    >
                        erweiterte Suche
                    </Button>
                    <animated.div
                        className={styles.advancedSettings}
                        style={springProps}
                    >
                        <h3>Erweiterte Suche</h3>
                        <CategorySelect
                            selectedCategory={category}
                            onSelectCategory={setCategory}
                        />
                    </animated.div>
                    <div className={styles.result}>
                        {isLoading && (
                            <span>
                                <CircularProgress
                                    style={{ height: '1em', width: '1em' }}
                                />{' '}
                                Beiträge werden gesucht ...
                            </span>
                        )}
                        {!isLoading && data && (
                            <span>
                                Es wurden {data.results.length} Beiträge
                                gefunden
                            </span>
                        )}
                        {!isLoading && !data && <span>&nbsp;</span>}
                    </div>
                </section>
                <section>
                    {data?.results.map((article: ArticleModel) => (
                        <ArticlePreviewDensedLayout
                            key={article.id}
                            article={article}
                            disableEdit
                            disablePin
                        />
                    ))}
                </section>
            </BaseLayoutMainContent>
            <BaseLayoutSidebar isEmpty />
        </>
    );
};

export const getServerSideProps = async ({}: GetServerSidePropsContext) => {
    return {
        props: {},
    };
};

export default Search;