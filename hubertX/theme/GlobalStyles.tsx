import * as React from 'react';
import { kebabCase } from 'lodash';
import { DefaultThemes } from '@lotta-schule/theme';
import Color from 'colorjs.io';

import './GlobalStyles.css';

export type ExternalFont = {
    /**
     * The name under which the font is registered in the theme, e.g. 'Roboto'
     **/
    name: string;

    /**
     * The URL to the font's CSS file, e.g. 'https://fonts.googleapis.com/css2?family=Roboto&display=fallback',
     * or could be a local file, e.g. '/fonts/Roboto.css' (served under the same domain as the app)
     **/
    url: string;
};

export type GlobalStylesProps = {
    supportedFonts?: ExternalFont[];
};

export const GlobalStyles = React.memo(
    ({ supportedFonts = [] }: GlobalStylesProps) => {
        const theme = DefaultThemes.standard; // TODO: Pass from server

        const getVarValue = (value: string) => {
            try {
                const color = new Color(value);
                const { r, g, b } = color.srgb;
                return [r, g, b].map((c) => (c * 255).toFixed(0)).join(', ');
            } catch (e) {
                return value;
            }
        };

        const getVarListWithName = (
            key: string,
            value: Record<string, any>
        ): [varname: string, varval: string][] => {
            return Object.keys(value).reduce((acc, valueKey) => {
                const varKey = [key, valueKey]
                    .filter(Boolean)
                    .map(kebabCase)
                    .join('-');
                const valueValue = value[valueKey];
                if (typeof valueValue === 'object') {
                    return acc.concat(getVarListWithName(varKey, valueValue));
                }
                return [...acc, [varKey, getVarValue(valueValue)]];
            }, [] as [string, string][]);
        };

        const cssContent = getVarListWithName('', theme).reduce(
            (acc, [varKey, varVal]) =>
                [acc, `--lotta-${varKey}: ${varVal};`].join('\n'),
            ''
        );

        // TODO: Add support for dynamic font loading
        for (const [varKey, varVal] of getVarListWithName('', theme)) {
            if (varKey.endsWith('-font-family')) {
                const fontName = varVal.match("'(.+)'")?.[1] ?? varVal;
                const fontDef = supportedFonts.find((f) => f.name === fontName);
                if (fontName && fontDef) {
                    if (
                        !document.head.querySelector(
                            `link[data-font-name="${fontName}"]`
                        )
                    ) {
                        const link = document.createElement('link');
                        link.setAttribute('rel', 'stylesheet');
                        link.setAttribute('href', fontDef.url);
                        link.setAttribute('data-font-name', fontName);
                        document.head.appendChild(link);
                    }
                }
            }
        }

        return (
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                  :root {
                    ${cssContent}
                  }
                  * { box-sizing: border-box; }
                  html,
                  body {
                      margin: 0;
                      font-family: var(--lotta-text-font-family);

                      @media print {
                          font-size: 8pt;
                      }
                  }

                  body {
                      margin: 0 auto;
                  }
                  body::after {
                      content: '';
                      position: fixed;
                      top: 0;
                      height: 100vh; /* fix for mobile browser address bar appearing disappearing */
                      left: 0;
                      right: 0;
                      z-index: -1;
                      background-color: rgba(var(--lotta-page-background-color), 1);
                      background-attachment: scroll;
                      background-size: cover;
                  }

                  ul {
                      padding: 0;
                      margin: 0;
                      list-style: none;
                  }

                  a {
                      color: inherit;
                      text-decoration: inherit;
                  }

                  figure {
                      margin: 0;
                  }

                  h1,
                  h2,
                  h3,
                  h4,
                  h5,
                  h6 {
                      margin-block-start: 0;
                      margin-block-end: calc(0.5 * var(--lotta-spacing));
                  }

                  h1 {
                      font-size: 2em;
                  }
                  h2 {
                      font-size: 1.5em;
                  }
                  h3 {
                      font-size: 1.25em;
                  }
                  h4 {
                      font-size: 1.2em;
                  }
                  h5,
                  h6 {
                      font-size: 1em;
                  }

                  fieldset {
                      border: none;
                      padding: 0;
                  }
                  `,
                }}
            />
        );
    }
);
GlobalStyles.displayName = 'GlobalHubertStyles';
