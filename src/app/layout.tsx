import { Main as MainLayout } from './components/Main';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicon/apple-touch-icon.png"
                />
                <link
                    rel="shortcut icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon/favicon-32x32.png"
                />
                <link
                    rel="shortcut icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon/favicon-16x16.png"
                />
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body>
                <MainLayout>{children}</MainLayout>
                <div id={'dialogContainer'} />
            </body>
        </html>
    );
};

export default RootLayout;
