import React, { FunctionComponent, memo } from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { CategoryModel } from '../../../model';

export interface NavbarProps {
    categories?: CategoryModel[];
}

export const Navbar: FunctionComponent<NavbarProps> = memo(({ categories }) => {
    return (
        <AppBar position={'sticky'}>
            <Toolbar>
                {categories && categories.map(category => (
                    <Button
                        key={category.id}

                        href={'/category'}
                        color={'inherit'}
                    >
                        {category.title}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
});