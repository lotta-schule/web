import * as React from 'react';
import { Category } from 'util/model';
import { useCategories } from 'util/categories/useCategories';
import Link from 'next/link';

import styles from './Footer.module.scss';

export const Footer = React.memo(() => {
    const categories = useCategories()[0].filter(
        (category) => category.isSidenav
    );
    return (
        <div className={styles.root}>
            {categories.map((category) => {
                return (
                    <React.Fragment key={category.id}>
                        <Link
                            href={
                                category.redirect || Category.getPath(category)
                            }
                            passHref
                        >
                            <a data-testid="SidenavLink">{category.title}</a>
                        </Link>
                        &nbsp;|&nbsp;
                    </React.Fragment>
                );
            })}
            <Link href={`/privacy`} passHref>
                <a data-testid="SidenavLink">Datenschutz</a>
            </Link>
        </div>
    );
});
Footer.displayName = 'Footer';
