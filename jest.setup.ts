import '@jest/globals';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

self.__NEXT_DATA__ = { ...self.__NEXT_DATA__ } as any;

// create setup document
const dialogContainer = document.createElement('div');
dialogContainer.setAttribute('id', 'dialogContainer');
document.body.appendChild(dialogContainer);

// window.matchMedia mock
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

Element.prototype.scroll = jest.fn();
Object.defineProperty(window, 'scrollTo', {
    writable: false,
    value: jest.fn(),
});

jest.mock('next/head', () => {
    const { createPortal } = jest.requireActual('react-dom');
    return {
        __esModule: true,
        default: ({ children }: any) =>
            createPortal(children, globalThis.document.head),
    };
});

jest.mock('next/config', () => ({
    __esModule: true,
    default: () => ({
        publicRuntimeConfig: {
            appEnvironment: '',
            sentryDsn: '',
            socketUrl: '',
            cloudimageToken: '',
        },
    }),
}));
