'use client';

import * as React from 'react';

import NProgress from 'nprogress';

export const TopProgressBar = () => {
    const enable = () => {
        NProgress.start();
    };
    const disable = () => {
        NProgress.done();
    };

    React.useEffect(() => {
        // listen on popstate event
        window.addEventListener('popstate', enable);
        return () => {
            disable();
            window.removeEventListener('popstate', enable);
        };
    }, []);
    return <div />;
};

export default TopProgressBar;
