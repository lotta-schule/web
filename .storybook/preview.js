import React from 'react';
import { deDE } from '@material-ui/core/locale';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

const primary = [38, 83, 191];
const text = [3, 3, 3];
const box_background = [255, 255, 255];

const toRgb = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;

const muiTheme = createMuiTheme({
  palette: {
    primary: { main: toRgb(primary)},
    text: { primary: toRgb(text) },
    box_background: { main: toRgb(box_background) }
  },
}, deDE);
export const decorators = [
  Story => (
    <ThemeProvider theme={muiTheme}>
      <style>{`
        :root {
          --lotta-primary-color: ${primary.join(', ')};
          --lotta-text-color: ${text.join(', ')};
          --lotta-box_background-color: ${box_background.join(', ')};
        }
      `}
      </style>
      <Story />
    </ThemeProvider>
  )
];